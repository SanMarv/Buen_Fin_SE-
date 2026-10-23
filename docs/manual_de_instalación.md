# Manual de instalación - El Buen Fin

## 1. Requisitos

- Node.js
- npm
- Docker y Docker Compose
- Almacenamiento compatible con S3

## 2. Descargar el proyecto

Clona el repositorio y entra a la carpeta:

```bash
git clone <url_del_repositorio>
cd Buen_Fin_SE
```

## 3. Configurar las variables de entorno

Copia el archivo de ejemplo a `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Abre `.env` y completa los valores necesarios para la base de datos , autenticación y almacenamiento. No subas credenciales reales (claves JWT ni claves HMAC al repositorio):

## 4. Configurar el almacenamiento y las buckets

El servicio de imágenes necesita un almacenamiento compatible con S3. Para desarrollo, configura uno accesible desde el proyecto en el puerto `9000`, como MinIO.

Añade al `.env` de la raíz la dirección y las credenciales usando los nombres de variables definidos en `.env.example`:

```env
S3_URL=<url_del_almacenamiento>
S3_ACCESS_KEY=<clave_de_acceso>
S3_PRIVATE_KEY=<clave_secreta>
```

Configura también las variables `S3_BUCKET_*` con los nombres de buckets esperados por el proyecto. Se utilizan buckets para distintos tipos de archivos, como imágenes de productos, imágenes de empresas y documentos de verificación.

Si las buckets no existen, créalas en MinIO o en el proveedor S3 que estés usando. Las credenciales deben tener permiso para leer y escribir en ellas. No incluyas credenciales reales en este manual.

## 5. Instalar dependencias

Desde la raíz del proyecto, ejecuta:

```bash
npm install
```

## 6. Iniciar servicios de desarrollo

Levanta los servicios de infraestructura configurados en Docker Compose:

```bash
npm run dev:up
```

La configuración de desarrollo inicia como PostgreSQL, el servicio de imágenes y el proxy. El backend y el front end se incian por separado.

Aplica el esquema de la base de datos:

```bash
npm run db:migration
```

Carga los datos iniciales:

```bash
npm run db:seed
```

## 7. Iniciar el backend

En una terminal, desde la raíz del proyecto, ejecuta:

```bash
npm run dev:back
```

## 8. Iniciar el frontend

Abre otra terminal y ejecuta:

```bash
cd src/services/frontend
npm install
npm run dev
```

## 9. Abrir la aplicación

Cuando los servicios estén inciados, abre esta dirección en el navegador:

```text
http://localhost:3002
```

El proxy publica la aplicción en el puerto `3000`y dirige las solicitudes al frontend y al backend.

## 10. Detener los servicios

Desde la raíz del proyecto, ejecuta:

```bash
npm run dev:down
```

## Solución de problemas

- **No conecta a la base de datos:** revisa las variables de conexión en `.env`y confirma que PostgreSQL este iniciado.
- **No se carga o guardan archivos:** confirma que el alamacenamiento S3 este activo, que la URL y las credenciales sean correctas, y que existan las buckets configuradas.
- **El frontend no encuentra la API:** revisa que `VITE_BACK_BASE`sea `http://localhost:3002/back` y que el backend y el proxy estén activos.
- **Un puerto esta ocupado:** detén el proceso que lo está usando o ajusta la configuración correspondiente.