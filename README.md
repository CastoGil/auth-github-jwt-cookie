# login-passport-JWT-cookie

Plantilla de autenticación para Node.js/Express que implementa inicio de sesión mediante GitHub OAuth, generación de JWT y almacenamiento seguro en cookies.

## ✅ Características
- Autenticación social con GitHub via Passport.js.
- Emisión de JWT firmados y almacenamiento en cookies httpOnly.
- Ruta `auth/current` para obtener el usuario autenticado.
- Middleware de autorización para proteger rutas.
- Plantillas Handlebars para vistas de login y dashboard.

## 💀 Stack
- Node.js, Express
- Passport.js (GitHubStrategy)
- jsonwebtoken
- cookie-parser
- Handlebars

## 🔧 Instalación

    git clone https://github.com/CastoGil/login-passport-JWT-cookie.git
    cd login-passport-JWT-cookie
    npm ci
    cp .env.example .env   # Rellena GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET
    npm start

## 💪 Uso
- Visita `/login` para iniciar sesión con GitHub.
- Tras la autenticación serás redireccionado a `/` con un JWT en cookie.
- Accede a `/api/users/current` para obtener tus datos.

## 🔐 Notas
- Configura correctamente las variables de entorno para GitHub OAuth.
- Asegúrate de usar cookies `httpOnly` y `secure` en producción.
