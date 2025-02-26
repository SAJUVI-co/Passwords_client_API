# **Usuarios - Claves Service**

Este controlador maneja la gestión de usuarios en un sistema distribuido mediante microservicios. Se encarga de crear, listar, eliminar (suavemente o permanentemente) y restaurar usuarios a través de un cliente `ClientProxy` de microservicios. [English DOC](../../english-DOC/claves/USERS.md)

#### **📂 Archivo:** `claves.controller.ts`

## **📌 Endpoints**
- [Crear un usuario](#**1️⃣-Crear-un-usuario**)
- [Obtener todos los usuarios](#**2️⃣-Obtener-todos-los-usuarios-(con-filtros)**)
- [Obtener todos los usuarios eliminados](#**3️⃣-Obtener-usuarios-eliminados**)
- [Obtener un usuario por ID](#**4️⃣-Obtener-un-usuario-por-ID**)
- [Eliminar un usuario](#**5️⃣-Eliminar-usuario-(Soft-Delete)**)
- [Eliminar un usuario permanentemente](#**6️⃣-Eliminar-usuario-(Hard-Delete)**)
- [Restaurar un usuario](#**7️⃣-Restaurar-usuario**)

### **1️⃣ Crear un usuario**

- **URL:** `/claves`
- **Método:** `POST`
- **Descripción:** Injecta un usuario ya creado de `/users`

*- Entrada (JSON):**

```json
{
  "email": "user@example.com",
  "username": "123456789",
  "password": "password123"
}
```

✅ **Salida esperada:**

- Devuelve el siguiente json

```json
{
  "access": true,
  "status": 200
}
```

🥅 **Errores:**
- Si el usuario ya existe
```json
{
    "statusCode": 400,
    "message": "The user already exists. Please use another data."
}
```

🔹 **Código:**

```typescript
@Post()
createUser(@Body() createClaveDto: CreateUserClaveDto) {
  try {
    return this.userServiceClient.send({ cmd: 'createUser' }, createClaveDto);
  } catch (error: any) {
    return new NotFoundException(error);
  }
}
```
---

### **2️⃣ Obtener todos los usuarios (con filtros)**

- **URL:** `/claves/all`
- **Método:** `GET`
- **Descripción:** Obtiene todos los usuarios, permitiendo filtrar por una paginación dinámica y orden.


📩 **Parámetros de consulta (query params):**

- `skip` (opcional, `int`, default: `0`) → Paginación: número de registros a omitir.
- `limit` (opcional, `int`, default: `10`) → Número máximo de usuarios a devolver.
- `order` (opcional, `string`, default: `"ASC"`) → Orden de los registros (`ASC` o `DESC`).

✅ **Salida esperada (JSON):**

```json
[
  {
    "created_at": "2025-02-25T09:09:51.037Z",
    "updated_at": "2025-02-26T08:20:01.000Z",
    "id": 6,
    "user_id": 2
  },
  {
    "created_at": "2025-02-26T01:13:58.777Z",
    "updated_at": "2025-02-26T01:13:58.777Z",
    "id": 14,
    "user_id": 8
  }
]
```

🔹 **Código:**

```typescript
@Get('/all')
findAllUsersF(
  @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: string,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
  @Query('order', new DefaultValuePipe('ASC')) order: string,
) {
  try {
    return this.userServiceClient.send({ cmd: 'findAllUsers' }, { skip, limit, order });
  } catch (error: any) {
    return new NotFoundException(error);
  }
}
```

🥅 **Errores**
- Si no hay usuarios registrados
```json
{
    "statusCode": 400,
    "message": "The user already exists. Please use another data."
}
```

---

### **3️⃣ Obtener usuarios eliminados**

- **URL:** `/claves/all/w`
- **Método:** `GET`
- **Descripción:** Obtiene todos los usuarios elimnados con paginación

📩 **Parámetros de consulta (query params):**

- `skip` (opcional, `int`, default: `0`) → Paginación: número de registros a omitir.
- `limit` (opcional, `int`, default: `10`) → Número máximo de usuarios a devolver.
- `order` (opcional, `string`, default: `"ASC"`) → Orden de los registros (`ASC` o `DESC`).

✅ **Salida esperada (JSON):**

```json
[
  {
    "created_at": "2025-02-26T01:13:44.133Z",
    "deleted_at": "2025-02-26T03:49:01.000Z",
    "id": 9,
    "user_id": 3
  },
  {
    "created_at": "2025-02-26T01:13:47.466Z",
    "deleted_at": "2025-02-26T03:54:53.000Z",
    "id": 10,
    "user_id": 4
  }
]
```

🥅 **Errores:**
- Si no hay usuarios eliminados
```json
{
    "statusCode": 400,
    "message": "Users not found"
}
```


🔹 **Código:**

```typescript
@Get('/all/w')
findAllW(
  @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: string,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
  @Query('order', new DefaultValuePipe('ASC')) order: string,
) {
  try {
    return this.userServiceClient.send({ cmd: 'findAllDeletedUsers' }, { skip, limit, order });
  } catch (error: any) {
    return new NotFoundException(error);
  }
}
```

---

### **4️⃣ Obtener un usuario por ID**

- **URL:** `/claves/one/:id`
- **Método:** `GET`
- **Descripción:** Devuelve un usuario específico por su ID.

📩 **Parámetro de ruta:**

- `id` (número) → ID del usuario a buscar.

✅ **Salida esperada (JSON):**

```json
{
  "created_at": "2025-02-26T01:13:50.222Z",
  "updated_at": "2025-02-26T01:13:50.222Z",
  "id": 11,
  "user_id": 5
}
```

🥅 **Errores:**
- Si no hay usuarios eliminados
```json
{
    "statusCode": 400,
    "message": "User not found"
}
```

🔹 **Código:**

```typescript
@Get('/one/:id')
findOneU(@Param('id') id: string) {
  try {
    return this.userServiceClient.send({ cmd: 'findOneUser' }, { id });
  } catch (error: any) {
    return new NotFoundException(error);
  }
}
```
---

### **5️⃣ Eliminar usuario (Soft Delete)**

- **URL:** `/claves/d/:id`  
- **Método:** `PATCH `
- **Descripción:** Realiza una eliminación suave (soft delete), marcando al usuario como eliminado sin borrarlo físicamente de la base de datos.

📩 **Parámetro de ruta:**

- `id` (número) → ID del usuario a eliminar.

✅ **Salida esperada:**

```json
"ok"
```

### 🥅 **Errores:**
> ⚠️ **IMPORTANTE:** AÚN NO SE HA VALIDADO QUE SI UN USUARIO YA HA SIDO ELIMINADO, NO SE PUEDA VOLVER A ELIMINAR.
No muestra el error, si no que devuelve `ok` en su lugar
- Si no hay usuarios eliminados:
```json
  {
      "statusCode": 400,
      "message": "User not found"
  }
```


🔹 **Código:**

```typescript
@Patch('/d/:id')
softDelUse(@Param('id') id: string) {
  try {
    return this.userServiceClient.send({ cmd: 'SD_user' }, { id });
  } catch (error) {
    return new NotFoundException(error);
  }
}
```

---

### **6️⃣ Eliminar usuario (Hard Delete)**

- **URL:** `/claves/d/:id`  
- **Método:** `DELETE`
- **Descripción:** Elimina completamente al usuario de la base de datos.

📩 **Parámetro de ruta:**

- `id` (número) → ID del usuario a eliminar permanentemente.

✅ **Salida esperada:**

```json
"ok"
```

### 🥅 **Errores:**
No muestra el error, si no que devuelve `ok` en su lugar
- Si no existe el usuario:
```json
  {
      "statusCode": 400,
      "message": "User not found"
  }
```
🔹 **Código:**

```typescript
@Delete('/d/:id')
rm_user(@Param('id') id: string) {
  try {
    return this.userServiceClient.send({ cmd: 'DEL_use' }, { id });
  } catch (error: any) {
    return new NotFoundException(error);
  }
}
```

---

### **7️⃣ Restaurar usuario**

- **URL:** `/claves/r/:id`  
- **Método:** `PATCH`
- **Descripción:** Restaura un usuario previamente eliminado (soft delete)

📩 **Parámetro de ruta:**

- `id` (número) → ID del usuario a Restaurar.

✅ **Salida esperada:**

```json
"ok"
```

### 🥅 **Errores:**
- Si no existe el usuario:
  ```json
  {
      "statusCode": 400,
      "message": "User not found"
  }
  ```


🔹 **Código:**

```typescript
@Patch('/r/:id')
res_user(@Param('id') id: string) {
  try {
    return this.userServiceClient.send({ cmd: 'res_User' }, { id });
  } catch (error: any) {
    return new NotFoundException(error);
  }
}
```

---
