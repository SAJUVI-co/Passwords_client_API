
# Users service
Conección y uso del servicio de usuarios.

## Endpoints
- [Crear Usuario](###crear-usuario)
- [Listar Usuarios con Paginación](###listar-usuarios-con-paginación)
- [Listar Todos los Usuarios](###listar-todos-los-usuarios)
- [Usuarios Ordenados por Fecha de Creación](###usuarios-ordenados-por-fecha-de-creación)
- [Iniciar Sesión](###iniciar-sesión)
- [Eliminar Usuario](###eliminar-usuario)

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
    
- Rspuesta Exitosa:
    > Esta respuesta es temporal, la idea es que sea un json y se validen los errores
    ```json
    true
    ```
    
- **Errores:**
    - `500 Bad Request`: Datos inválidos.
---

### Listar Usuarios con Paginación

- **URL:** `/users`
- **Método:** `GET`
- **Descripción:** Obtiene una lista de usuarios con paginación.
- **Parámetros de Consulta:**
    - `skip` (opcional): Número de registros a omitir (por defecto: `0`).
    - `limit` (opcional): Número máximo de registros a devolver (por defecto: `10`).
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
    
- **Errores:**
    - `500 Internal Server Error`: Error en la conexión con el microservicio.

---

### Listar Todos los Usuarios

- **URL:** `/users`
- **Método:** `GET`
- **Descripción:** Obtiene todos los usuarios sin filtros ni paginación.
- **Respuesta Exitosa:**
    
    ```json
    [
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
      }
    ]
    
    ```
    
- **Errores:**
    - `500 Internal Server Error`: Error en la conexión con el microservicio.

---

### Usuarios Ordenados por Fecha de Creación
> RUTA NO FUNCIONAL ACTUALMENTE
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

### Iniciar Sesión

- **URL:** `/users/login`
- **Método:** `POST`
- **Descripción:** Autentica a un usuario y actualiza su estado en línea.
- **Cuerpo de la solicitud:**
    
    ```json
    {
      "username": "example123",
      "password": "exampl3e@exdfmple.com"
    }
    ```
    
- **Respuesta Exitosa:**
    
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
    - `401 Unauthorized`: Credenciales inválidas.

---

### Eliminar Usuario

- **URL:** `/users/delete`
- **Método:** `DELETE`
- **Descripción:** Elimina un usuario específico.
- **Cuerpo de la solicitud:**
    
    ```json
    json
    CopiarEditar
    {
      "id": 1
    }
    
    ```
    
- **Respuesta Exitosa:**
    
    ```json
    json
    CopiarEditar
    {
      "success": true,
      "message": "Usuario eliminado correctamente."
    }
    
    ```
    
- **Errores:**
    - `404 Not Found`: Usuario no encontrado.
    - `500 Internal Server Error`: Error en el microservicio.

---

## Manejo de Errores

El manejo de errores en el API Gateway sigue las mismas estrategias que el microservicio de usuarios:

1. **Errores de Validación:** Se devuelven con un código `400 Bad Request` e incluyen detalles específicos sobre los errores de validación.
2. **Errores del Microservicio:** Los errores internos se devuelven con un código `500 Internal Server Error`.
3. **Errores de Autenticación:** Devuelven un código `401 Unauthorized` cuando las credenciales son incorrectas.
4. **Errores de Negocio:** Devuelven un código `409 Conflict` para errores como duplicidad de datos.
5. **Errores no Controlados:** Cualquier error inesperado se captura globalmente y se devuelve como un error genérico con un código `500 Internal Server Error`.

**Ejemplo de Respuesta de Error Genérico:**

```json
{
  "statusCode": 500,
  "message": "Ocurrió un error inesperado."
}
```
