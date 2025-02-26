The API Gateway serves as the centralized entry point for interacting with microservices. This module acts as an intermediary between clients and the user management microservice. It is responsible for receiving HTTP requests, validating them, and forwarding them to the appropriate microservice using NestJS's `ClientProxy`. [Documentación en español](../../README.md)  

---  

## **Environment Configuration**  

The service requires the following environment variables to be set:  

| Variable | Description | Example |  
| --- | --- | --- |  
| `SERVER_PORT` | Port where the API Gateway runs | `3000` |  
| `SERVER_HOST` | API Gateway host address | `localhost` |  
| `SERVICE_USER_NAME` | Name of the user microservice | `your service name` |  
| `SERVICE_USER_HOST` | User microservice host | `localhost` |  
| `SERVICE_USER_PORT` | User microservice port | `your service port` |  

---  

## **Initialization**  

> Before starting the service, ensure that all required services are running.  

### **Run the API Gateway in development mode:**  

```bash
pnpm install
pnpm start:dev
```  

---  

## **Route Documentation**  
- [Users](./DOCS/spanish-DOC/users/USERS.md)  
- [Keys - Users](./DOCS/spanish-DOC/claves/USERS.md)  
