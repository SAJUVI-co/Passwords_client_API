# Users service

Conexión y uso del servicio de usuarios.

## Endpoints

- [Crear Usuario](#crear-usuario)  
- [Obtener Token](#obtener-token)  
- [Iniciar Sesión](#iniciar-sesión)  
- [Listar Usuarios con Paginación](#listar-usuarios-con-paginación)  
- [Usuarios Ordenados por Fecha `Not work`](#listar-usuarios-ordenados-por-fecha-not-work)  
- [Listar Usuarios por Estado (`Online || Offline`) `Not work`](#listar-usuarios-por-estado-online--offline-not-work)  
- [Actualizar Usuario](#actualizar-usuario)  
- [Actualizar un Usuario como Administrador](#actualizar-un-usuario-como-administrador)  
- [Eliminar Usuario](#eliminar-usuario)  
- [Eliminar Permanentemente un Usuario `Not work`](#eliminar-permanentemente-un-usuario-not-work)  

### Crear Usuario

- **URL:** `/users`
- **Método:** `POST`
- **Descripción:** Crea un nuevo usuario.
- **Cuerpo de la solicitud:**
    
    ```json
    {
      "email": "user@exdfmple.com",
      "username": "user123456", // se recomienda que el usuario sea el numero de cedula
      "password": "password123"
    }
    
    ```
    
- Respuesta Exitosa:
    
    > Esta respuesta es temporal, la idea es que sea un json y se validen los errores
    > 
    
    ```json
    {
        "access": true,
        "status": 200
    }
    ```
    
- **Errores:**
    - `500 Bad Request`: Datos inválidos.
    - `400 {field} is required`: Campos requeridos
        
        ```json
        {
            "message": "The password field is required.",
            "error": "Bad Request",
            "statusCode": 400
        }
        ```
        

---

### Obtener Token

- **URL:** `/users/token`
- **Método:** `POST`
- **Descripción:** Crea un nuevo usuario.
- **Cuerpo de la solicitud:**
    
    ```json
    {
        "username": "examp1le14",
        "password": "password123"
    }
    ```
    
- Respuesta esperada: `200`
    
    ```json
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImV4YW1wMWxlMTQiLCJlbWFpbCI6InBhc3N3b3JkMTIzIiwiaWF0IjoxNzQxMjkxMDUwLCJleHAiOjE3NDEzMzQyNTB9.v1wMb9R5guqw-SqLV1gvxin01AAcQLUA5hsC8lGau68"
    }
    ```
    
- **Errores:**
    - `400`
        
        ```json
        {
            "message": "The password field is required.",
            "error": "Bad Request",
            "statusCode": 400
        }
        ```
        
    - `401`
        
        ```json
        {
            "statusCode": 400,
            "message": "Invalid Credentials"
        }
        ```
        

---

### Iniciar Sesión

- **URL:** `/users/login`
- **Método:** `POST`
- **Descripción:** Autentica a un usuario y actualiza su estado en línea.
- **Autorización: `Bearer token`**
- **Cuerpo de la solicitud:**
    
    ```json
    {
      "username": "example123",
      "password": "exampl3e@exdfmple.com"
    }
    
    ```
    
- **Respuesta Exitosa: `200`**
    
    ```json
    {
      "id": 33,
      "username": "example7",
      "email": "exampl8@exmple.com",
      "email_recuperacion": "exampl8@exmple.com",
      "rol": "invite",
      "online": true,
      "created_at": "2025-02-18T01:55:38.047Z",
      "updated_at": "2025-02-18T02:20:36.000Z",
      "deleted_at": null
    }
    
    ```
    
- **Errores:**
    - `400`
        
        ```json
        {
            "message": "The password field is required.",
            "error": "Bad Request",
            "statusCode": 400
        }
        ```
        
    - `401`
        
        ```json
        {
            "message": "No token provided",
            "error": "Unauthorized",
            "statusCode": 401
        }
        ```
        
    - `404`
        
        ```json
        {
            "message": "El usuario no existe",
            "statusCode": 400
        }
        ```
        

---

### Listar Usuarios con Paginación

- **URL:** `/users`
- **Método:**  `POST`
- **Descripción:** Obtiene una lista de usuarios con paginación.
- **Autorización: `Bearer token`**
- **Parámetros de Consulta:**
    - `skip` (opcional): Número de registros a omitir (por defecto: `0`).
    - `limit` (opcional): Número máximo de registros a devolver (por defecto: `10`).
    - `order` (opcional): Orden de los resultados (`ASC` o `DESC`).
- Autorización: `Bearer Token`
- Body:
    
    ```json
    {
        "id": 66,
        "username": "1005210392",
        "password": "123456789"
    }
    ```
    
- **Respuesta Exitosa: `200`**
    
    ```json
    [
    		[
    			{
    			"id": 5,
    			"username": "ju65412sdf23",
    			"email": "[juan@examplis.com](mailto:juan@examplis.com)",
    			"email_recuperacion": "[juan@exdfmple.com](mailto:juan@exdfmple.com)",
    			"rol": "admin",
    			"online": true,
    			"created_at": "2025-02-17T15:58:45.609Z",
    			"updated_at": "2025-03-06T20:20:26.000Z"
    			},
    			{
    			"id": 6,
    			"username": "example123",
    			"email": "[exampl3e@exdfmple.com](mailto:exampl3e@exdfmple.com)",
    			"email_recuperacion": "[exampl3e@exdfmple.com](mailto:exampl3e@exdfmple.com)",
    			"rol": "invite",
    			"online": true,
    			"created_at": "2025-02-17T20:32:14.150Z",
    			"updated_at": "2025-03-06T20:57:21.000Z"
    			}
    		],
    		21
    ]
    ```
    
- **Errores:**
    - `500 Internal Server Error`: Error en la conexión con el microservicio.
    - `400`:
        
        ```
        {
            "statusCode": 400,
            "message": "El usuario no existe"
        }
        ```
        
    - `401`: Credenciales invalidas
        
        ```
        {
            "statusCode": 400,
            "message": "Invalid Credentials"
        }
        ```
        
    - `403`: No autorizado
        
        ```json
        {
            "message": "Sorry, you dont have acces to this route",
            "error": "Unauthorized",
            "statusCode": 401
        }
        ```
        
    - `404`:  Usuario no encontrado
        
        ```
        {
            "statusCode": 404,
            "message": "Users not found"
        }
        ```
        
    - `500 Internal Server Error`: Error en el microservicio.

---

### Listar Usuarios Ordenados por Fecha `Not work`

> RUTA NO FUNCIONAL ACTUALMENTE
> 
- **URL:** `/users/sorted-by-creation`
- **Método:** `GET`
- **Descripción:** Lista los usuarios ordenados por fecha de creación.
- **Parámetros de Consulta:**
    - `order` (opcional): Orden de los resultados (`ASC` o `DESC`).
- **Respuesta Exitosa:**
    
    ```json
    {
        "users": [
            {
                "id": 6,
                "username": "example123",
                "email": "exampl3e@exdfmple.com",
                "email_recuperacion": "exampl3e@exdfmple.com",
                "rol": "invite",
                "online": false,
                "created_at": "2025-02-18T01:32:14.150Z",
                "updated_at": "2025-02-18T01:32:14.150Z",
                "deleted_at": null,
                "sequentialId": 2
            },
            {
              "id": 17,
              "username": "example1234",
              "email": "exampl2e@exdfmple.com",
              "email_recuperacion": "exampl2e@exdfmple.com",
              "rol": "invite",
              "online": false,
              "created_at": "2025-02-18T01:46:31.621Z",
              "updated_at": "2025-02-18T01:46:31.621Z",
              "deleted_at": null,
              "sequentialId": 3
          }
        ],
        "total": 2
    }
    
    ```
    

---

### Listar usuarios por estado (`Online || Offline`) `Not work`

---

### Actualizar Usuario

- **URL:** `/users`
- **Método:** `PATCH`
- **Descripción:** Actualizar un usuario
- **Autorización: `Bearer Token`**
- **Cuerpo de la solicitud:**
    
    ```json
    {
        "id": 66,
        "username": "1005210392",
        "password": "123456789",
        "info": { // datos a actualizar
            "id": 66, // tiene que ser el mismo ingresado al inicio de la solicitud
            "email": "examp1le14@gmail.com"
        }
    }
    ```
    
- **Respuesta Exitosa: `200`**
    
    ```json
    true
    ```
    
- **Errores:**
    - `400 Bad Request`
        
        ```json
        {
            "message": "Some field is required.",
            "error": "Bad Request",
            "statusCode": 400
        }
        ```
        
    - `401 Unauthorized rol` : Lanza error si el usuario (no `Admin`)  intenta cambiar su rol
        
        ```json
        {
            "message": "You dont have access to change the role",
            "error": "Unauthorized",
            "statusCode": 401
        }
        ```
        
    - `401 Unauthorized`
        
        ```json
        {
            "message": "No token provided",
            "error": "Unauthorized",
            "statusCode": 401
        }
        ```
        
    - `404 User not found`
        
        ```json
        {
            "statusCode": 400,
            "message": "El usuario no existe"
        }
        ```
        
    - `403 forbidden`
        
        ```
        {
            "message": "something is wrong",
            "error": "Forbidden",
            "statusCode": 403
        }
        ```
        
    - `500 Internal Server Error`: Error en el microservicio.

---

### Actualizar un Usuario como Administrador

- **URL:** `users/up/r/a`
- **Método:** `PUT`
- **Descripción:** Si las credenciales son de algún administrador, este puede actualizar cualquier campo de otro usuario, así como de si mismo.
- **Autorización: `Bearer Token`**
- **Cuerpo de la solicitud:**
    
    ```json
    {
        "id": 66,
        "username": "1005210392",
        "password": "123456789",
        "info": { // info a actualizar
            "id": 67, // id del usuario a actualizar
            "rol": "admin"
        }
    }
    ```
    
- **Respuesta Exitosa: `200`**
    
    ```json
    true
    ```
    
- **Errores:**
    - `400 Invalid Credentials`
        
        ```json
        {
            "statusCode": 400,
            "message": "Invalid Credentials"
        }
        ```
        
    - `400 Bad Request`
        
        ```json
        {
            "message": "Some field is required.",
            "error": "Bad Request",
            "statusCode": 400
        }
        ```
        
    - `401 Unauthorized rol` : Lanza error si el usuario (no `Admin`)  intenta usar la ruta
        
        ```json
        {
            "message": "You dont have access to change the role",
            "error": "Unauthorized",
            "statusCode": 401
        }
        ```
        
    - `401 Unauthorized`
        
        ```json
        {
            "message": "No token provided",
            "error": "Unauthorized",
            "statusCode": 401
        }
        ```
        
    - `404 User not found`
        
        ```json
        {
            "statusCode": 400,
            "message": "El usuario no existe"
        }
        ```
        
    - `403 forbidden`
        
        ```
        {
            "message": "something is wrong",
            "error": "Forbidden",
            "statusCode": 403
        }
        ```
        
    - `500 Internal Server Error`: Error en el microservicio.

---

### Eliminar Usuario

- **URL:** `/users/deleteUser`
- **Método:** `DELETE`
- **Descripción:** Elimina un usuario específico.
- **Autorización: `Bearer Token`**
- **Cuerpo de la solicitud:**
    
    ```json
    {
        "id": 67,
        "username": "1005210391",
        "password": "123456789"
    }
    ```
    
- **Respuesta Exitosa: `200`**
    
    ```json
    ok
    ```
    
- **Errores:**
    - `400 Bad Request` :
        
        ```json
        {
            "message": "The password or username field is required.",
            "error": "Bad Request",
            "statusCode": 400
        }
        ```
        
    - `404 User not found`
        
        ```json
        {
            "statusCode": 400,
            "message": "El usuario no existe"
        }
        ```
        
    - `403 forbidden`
        
        ```
        {
            "message": "something is wrong",
            "error": "Forbidden",
            "statusCode": 403
        }
        ```
        
    - `500 Internal Server Error`: Error en el microservicio.

---

### Eliminar Permanentemente un usuario `Not work`
---
