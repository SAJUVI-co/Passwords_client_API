El API Gateway sirve como punto de entrada centralizado para interactuar con los microservicios. Este módulo actúa como intermediario entre los clientes y el microservicio de gestión de usuarios. Se encarga de recibir las solicitudes HTTP, validarlas y enviarlas al microservicio correspondiente utilizando `ClientProxy` de NestJS.

---

## Configuración del Entorno

El servicio requiere que las siguientes variables de entorno estén configuradas:

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `SERVER_PORT` | Puerto donde corre el API Gateway | `3000` |
| `SERVER_HOST` | Dirección del host del API Gateway | `localhost` |
| `SERVICE_USER_NAME` | Nombre del microservicio de usuarios | `your service name` |
| `SERVICE_USER_HOST` | Host del microservicio de usuarios | `localhost` |
| `SERVICE_USER_PORT` | Puerto del microservicio de usuarios | `your service port` |

---

## Inicialización

### Ejecutar el API Gateway en modo desarrollador:

```bash
pnpm install
pnpm start:dev
```

---
