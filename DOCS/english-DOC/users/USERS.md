# Users Service  
Connection and usage of the user service.  

## Endpoints  
- [Create User](###-**Create-User**)  
- [List Users with Pagination](###-**List-Users-with-Pagination**)  
- [List All Users](###-**List-All-Users**)  
- [Users Sorted by Creation Date](###-**Users-Sorted-by-Creation-Date**)  
- [Login](###-**Login**)  
- [Delete User](###-**Delete-User**)  

---

### **Create User**  

- **URL:** `/users`  
- **Method:** `POST`  
- **Description:** Creates a new user.  
- **Request Body:**  

    ```json
    {
      "email": "user@exdfmple.com",
      "username": "user123456", // it is recommended that the username be the ID number
      "password": "password123"
    }
    ```  

- **Successful Response:**  
    > This response is temporary; the goal is to return a JSON and validate errors.  
    ```json
    true
    ```  

- **Errors:**  
    - `500 Bad Request`: Invalid data.  

---

### **List Users with Pagination**  

- **URL:** `/users`  
- **Method:** `GET`  
- **Description:** Retrieves a paginated list of users.  
- **Query Parameters:**  
    - `skip` (optional): Number of records to skip (default: `0`).  
    - `limit` (optional): Maximum number of records to return (default: `10`).  
    - `order` (optional): Order of results (`ASC` or `DESC`).  
- **Successful Response:**  

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

- **Errors:**  
    - `500 Internal Server Error`: Error connecting to the microservice.  

---

### **List All Users**  

- **URL:** `/users`  
- **Method:** `GET`  
- **Description:** Retrieves all users without filters or pagination.  
- **Successful Response:**  

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

- **Errors:**  
    - `500 Internal Server Error`: Error connecting to the microservice.  

---

### **Users Sorted by Creation Date**  
> **Currently Not Functional**  
- **URL:** `/users/sorted-by-creation`  
- **Method:** `GET`  
- **Description:** Lists users sorted by creation date.  
- **Query Parameters:**  
    - `order` (optional): Order of results (`ASC` or `DESC`).  
- **Successful Response:**  

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

### **Login**  

- **URL:** `/users/login`  
- **Method:** `POST`  
- **Description:** Authenticates a user and updates their online status.  
- **Request Body:**  

    ```json
    {
      "username": "example123",
      "password": "exampl3e@exdfmple.com"
    }
    ```  

- **Successful Response:**  

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

- **Errors:**  
    - `401 Unauthorized`: Invalid credentials.  

---

### **Delete User**  

- **URL:** `/users/delete`  
- **Method:** `DELETE`  
- **Description:** Deletes a specific user.  
- **Request Body:**  

    ```json
    {
      "id": 1
    }
    ```  

- **Successful Response:**  

    ```json
    {
      "success": true,
      "message": "User deleted successfully."
    }
    ```  

- **Errors:**  
    - `404 Not Found`: User not found.  
    - `500 Internal Server Error`: Microservice error.  

---

## **Error Handling**  

The API Gateway follows the same error-handling strategies as the user microservice:  

1. **Validation Errors:** Returned with a `400 Bad Request` code and include specific details about the validation errors.  
2. **Microservice Errors:** Internal errors are returned with a `500 Internal Server Error` code.  
3. **Authentication Errors:** Return a `401 Unauthorized` code when credentials are incorrect.  
4. **Business Logic Errors:** Return a `409 Conflict` code for errors such as data duplication.  
5. **Unhandled Errors:** Any unexpected error is captured globally and returned as a generic error with a `500 Internal Server Error` code.  

**Example of Generic Error Response:**  

```json
{
  "statusCode": 500,
  "message": "An unexpected error occurred."
}
```  