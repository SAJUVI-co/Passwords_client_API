# **Users - Claves - Service**

This controller manages user administration in a distributed system using microservices. It handles creating, listing, deleting (soft or permanent), and restoring users through a `ClientProxy` microservice client. [Spanish DOC](../../spanish-DOC/claves/USERS.md)

#### **📂 File:** `claves.controller.ts`

## **📌 Endpoints**
- [Create a user](###-**1️⃣-Create-a-user**)
- [Get all users](###-**2️⃣-Get-all-users-(with-filters)**)
- [Get all deleted users](###-**3️⃣-Get-deleted-users**)
- [Get a user by ID](###-**4️⃣-Get-a-user-by-ID**)
- [Soft delete a user](###-**5️⃣-Soft-delete-user**)
- [Permanently delete a user](###-**6️⃣-Hard-delete-user**)
- [Restore a user](###-**7️⃣-Restore-user**)

---

### **1️⃣ Create a user**

- **URL:** `/claves`
- **Method:** `POST`
- **Description:** Injects a previously created user from `/users`.

📩 **Request body (JSON):**

```json
{
  "email": "user@example.com",
  "username": "123456789",
  "password": "password123"
}
```

✅ **Expected Response:**

- Returns the following JSON:

```json
{
  "access": true,
  "status": 200
}
```

🥅 **Errors:**
- If the user already exists:
```json
{
    "statusCode": 400,
    "message": "The user already exists. Please use another data."
}
```

🔹 **Code:**
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

### **2️⃣ Get all users (with filters)**

- **URL:** `/claves/all`
- **Method:** `GET`
- **Description:** Retrieves all users, allowing filtering with dynamic pagination and sorting.

📩 **Query Parameters:**
- `skip` (optional, `int`, default: `0`) → Pagination: number of records to skip.
- `limit` (optional, `int`, default: `10`) → Maximum number of users to return.
- `order` (optional, `string`, default: `"ASC"`) → Sorting order (`ASC` or `DESC`).

✅ **Expected Response (JSON):**
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

🔹 **Code:**
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

🥅 **Errors:**
- If no users are registered:
```json
{
    "statusCode": 400,
    "message": "No users found."
}
```
---

### **3️⃣ Get deleted users**

- **URL:** `/claves/all/w`
- **Method:** `GET`
- **Description:** Retrieves all deleted users with pagination.

📩 **Query Parameters:**
- `skip` (optional, `int`, default: `0`) → Pagination: number of records to skip.
- `limit` (optional, `int`, default: `10`) → Maximum number of users to return.
- `order` (optional, `string`, default: `"ASC"`) → Sorting order (`ASC` or `DESC`).

✅ **Expected Response (JSON):**
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

🥅 **Errors:**
- If no deleted users exist:
```json
{
    "statusCode": 400,
    "message": "Users not found"
}
```
---

### **4️⃣ Get a user by ID**

- **URL:** `/claves/one/:id`
- **Method:** `GET`
- **Description:** Retrieves a specific user by their ID.

📩 **Path Parameter:**
- `id` (integer) → ID of the user to retrieve.

✅ **Expected Response (JSON):**
```json
{
  "created_at": "2025-02-26T01:13:50.222Z",
  "updated_at": "2025-02-26T01:13:50.222Z",
  "id": 11,
  "user_id": 5
}
```

🥅 **Errors:**
- If the user is not found:
```json
{
    "statusCode": 400,
    "message": "User not found"
}
```
---

### **5️⃣ Soft delete user**

- **URL:** `/claves/d/:id`
- **Method:** `PATCH`
- **Description:** Performs a soft delete, marking the user as deleted without permanently removing them from the database.

📩 **Path Parameter:**
- `id` (integer) → ID of the user to delete.

✅ **Expected Response:**
```json
"ok"
```

🥅 **Errors:**
> ⚠️ **IMPORTANT:** IT HAS NOT YET BEEN VALIDATED WHETHER A USER CAN BE DELETED AGAIN AFTER ALREADY BEING DELETED.
It does not show an error but instead returns `ok`.

- If no deleted users exist:
```json
{
    "statusCode": 400,
    "message": "User not found"
}
```
---

### **6️⃣ Hard delete user**

- **URL:** `/claves/d/:id`
- **Method:** `DELETE`
- **Description:** Permanently removes the user from the database.

📩 **Path Parameter:**
- `id` (integer) → ID of the user to delete permanently.

✅ **Expected Response:**
```json
"ok"
```

🥅 **Errors:**
- If the user does not exist:
```json
{
    "statusCode": 400,
    "message": "User not found"
}
```
---

### **7️⃣ Restore user**

- **URL:** `/claves/r/:id`
- **Method:** `PATCH`
- **Description:** Restores a previously deleted (soft delete) user.

📩 **Path Parameter:**
- `id` (integer) → ID of the user to restore.

✅ **Expected Response:**
```json
"ok"
```

🥅 **Errors:**
- If the user does not exist:
```json
{
    "statusCode": 400,
    "message": "User not found"
}
```
---
