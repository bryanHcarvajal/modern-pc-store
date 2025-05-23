# ✨ AMD PCStore ✨

<p align="center">
  <img src="client/src/assets/images/amd-ryzen-logo.png" alt="AMD PCStore Logo" width="120"/> 
</p>

Un prototipo de tienda web moderna y elegante para componentes de computadora, enfocada en productos AMD. Construida con tecnologías full-stack de vanguardia.

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/TypeORM-E0234E?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion">
</p>

## 🌟 Características Implementadas

*   **Diseño Moderno e Impactante:** Interfaz de usuario elegante con Tailwind CSS (v4) y animaciones fluidas con Framer Motion.
*   **Navegación Intuitiva:** Navbar moderno y responsivo, y un footer informativo. El Navbar se actualiza dinámicamente según el estado de autenticación del usuario y sus roles.
*   **Página de Inicio Dinámica:**
    *   Video de fondo con efecto blur y control de reproducción.
    *   Secciones de productos principales (Ryzen, Radeon) con animaciones de scroll y efectos hover interactivos (círculos de porcentaje/FPS simulados).
*   **Autenticación y Autorización de Usuarios:**
    *   Registro de nuevos usuarios con hashing seguro de contraseñas (bcrypt).
    *   Inicio de sesión de usuarios con generación de JSON Web Tokens (JWT).
    *   Manejo de roles de usuario (user, admin).
    *   Rutas protegidas en el frontend y backend basadas en autenticación y roles.
    *   Página "Mi Cuenta" para usuarios logueados, mostrando información de perfil e historial de compras.
*   **Catálogo de Productos:**
    *   Listado de tarjetas gráficas y procesadores AMD servidos desde una base de datos PostgreSQL a través de una API NestJS.
    *   Página de detalle para cada producto.
    *   Funcionalidad de búsqueda por texto en el catálogo.
    *   Filtros por tipo de producto (CPU/GPU).
    *   Navegación a filtros pre-aplicados desde la página de inicio.
*   **Carrito de Compras Funcional:**
    *   Los usuarios autenticados pueden añadir productos a su carrito.
    *   Visualización del carrito con opción de actualizar cantidades y eliminar items.
    *   Posibilidad de vaciar el carrito completo (con confirmación).
    *   Interacción persistente con el backend para el manejo del carrito.
*   **Proceso de Compra Simulado:**
    *   Página de Checkout para revisar el pedido.
    *   Botón "Confirmar Compra" que crea una orden en la base de datos y vacía el carrito.
    *   Página de confirmación de pedido.
*   **Gestión de Productos para Administradores (CRUD):**
    *   Interfaz de administración protegida para usuarios con rol 'admin'.
    *   Listado de todos los productos de la base de datos.
    *   Formulario para crear nuevos productos.
    *   Funcionalidad para eliminar productos existentes (con confirmación).
    *   (Placeholder para la edición de productos).
*   **Backend Robusto y Escalable:**
    *   API construida con NestJS y TypeScript.
    *   Integración con PostgreSQL usando TypeORM para la persistencia de datos (usuarios, productos, carritos, órdenes).
    *   Validación de datos de entrada (DTOs) con `class-validator`.
    *   Configuración de CORS para la comunicación segura entre frontend y backend.
*   **Experiencia de Desarrollo Optimizada:**
    *   Uso de Vite para un Hot Module Replacement (HMR) ultrarrápido en el frontend.
    *   Estructura de proyecto modular y bien organizada.
*   **UI/UX Mejorada:**
    *   Notificaciones (toasts) para acciones del usuario (ej. producto añadido al carrito, error de login, etc.).
    *   Indicadores de carga para operaciones asíncronas.
    *   Manejo de estados de error.

## 🛠️ Tecnologías Utilizadas

*   **Frontend (`client/`):**
    *   [React.js](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/) 
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
    *   [React Router DOM](https://reactrouter.com/) 
    *   [Framer Motion](https://www.framer.com/motion/) 
    *   [React Icons](https://react-icons.github.io/react-icons/) 
    *   [React Hot Toast](https://react-hot-toast.com/)
    *   React Context API 
*   **Backend (`server/`):**
    *   [Nest.JS](https://nestjs.com/) 
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [PostgreSQL](https://www.postgresql.org/)
    *   [TypeORM](https://typeorm.io/) 
    *   [JWT (JSON Web Tokens)](https://jwt.io/) 
    *   [bcrypt](https://www.npmjs.com/package/bcrypt) 
    *   `class-validator`, `class-transformer`
    *   `@nestjs/config` 

## ⚙️ Configuración y Ejecución Local

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (v18.x o v20.x recomendado)
*   [npm](https://www.npmjs.com/) 
*   [Git](https://git-scm.com/)
*   Una instancia de **PostgreSQL** corriendo y accesible.

### Pasos para la Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/bryanHcarvajal/modern-pc-store.git
    cd TU_REPOSITORIO
    ```
    
2.  **Configuración del Backend:**
    *   Navega a la carpeta del servidor:
        ```bash
        cd server
        ```
    *   **Crear el archivo `.env`:**
        Desde PowerShell, dentro de la carpeta `server/`, ejecuta:
        ```powershell
        New-Item .env
        ```
        Luego, abre el archivo `.env` recién creado con un editor de texto (como VS Code, Notepad, etc.) y pega el siguiente contenido, **asegurándote de reemplazar los valores placeholder con tus credenciales reales y secretos**:
        ```env
        # PostgreSQL Configuration
        DB_TYPE=postgres
        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=tu_usuario_postgres
        DB_PASSWORD=tu_contraseña_postgres
        DB_DATABASE=modern_pc_store_db # O el nombre que le diste a tu BD
        DB_SYNCHRONIZE=true # Ppara desarrollo

        # JWT Configuration
        JWT_SECRET=TU_SUPER_SECRETO_JWT_UNICO_Y_LARGO_AQUI
        JWT_EXPIRATION_TIME=3600s # ej. 1 hora (puedes usar s, m, h, d)
        ```
        **Importante:** No incluyas comillas alrededor de los valores en el archivo `.env` a menos que sean parte del valor mismo (generalmente no lo son para secretos o nombres de usuario).
    *   Instala las dependencias del backend:
        ```bash
        npm install
        ```

3.  **Configuración del Frontend:**
    *   Navega a la carpeta del cliente:
        ```bash
        cd ../client 
        # (Si estabas en server/, sino cd client/ desde la raíz)
        ```
    *   Instala las dependencias del frontend:
        ```bash
        npm install
        ```

### Ejecución

1.  **Inicia el Servidor Backend:**
    Desde la carpeta `server/` (en una terminal):
    ```bash
    npm run start:dev
    ```
    El backend estará disponible en `http://localhost:3000` (o el puerto configurado en tu `.env` o `main.ts`).

2.  **Inicia la Aplicación Frontend:**
    Desde la carpeta `client/` (en una nueva terminal):
    ```bash
    npm run dev
    ```
    La aplicación frontend estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

Abre tu navegador y ve a la URL del frontend para explorar la tienda. Para acceder a las funcionalidades de administración, necesitarás registrar un usuario y luego modificar su rol a 'admin' directamente en la base de datos PostgreSQL (ej. `UPDATE users SET roles = ARRAY['admin', 'user'] WHERE email = 'tu_email_admin@example.com';` usando `psql` o una herramienta gráfica de base de datos).

## 📄 Licencia

Este proyecto es para fines de portfolio y aprendizaje. Siéntete libre de usarlo como referencia.

---

_Desarrollado con ❤️, TypeScript y muchas pruebas._
