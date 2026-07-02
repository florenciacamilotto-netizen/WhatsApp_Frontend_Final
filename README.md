FRONTEND

[CREDENCIALES]

(DUEÑO)
Email: flordelyrics@gmail.com
Password: flordelyrics1234

(USUARIO)
Email: florenciacamilotto@gmail.com
Password: florenciacamilotto1234

(USUARIO)
Email: florencia_belen00@hotmail.com
Password: florenciabelen1234

[DESARROLLO]

Pasos que seguí, a partir de cada clase, para la creación del Frontend:

CONFIGURACIÓN INICIAL DEL PROYECTO

1. Instalar Node.js y crear el proyecto con Vite + React (npm create vite@latest)
2. Cambiar el comando "type": "module" (ESM)
3. Modificar el archivo package.json: scripts "dev" (vite), "build" (vite build), "preview" (vite preview) y "lint" (eslint.)
4. Incorporar la librería node_modules: react-router-dom, jwt-decode, react-icons, emoji-picker-react
5. Incorporar el archivo .env para guardar la URL del Backend

Ejemplo de variable cargada en .env:

**VITE_URL_API=** https://whats-app-final-project.vercel.app

// A diferencia de un .env de Node.js, en Vite toda variable expuesta al cliente debe empezar con el prefijo VITE_ //

6. Incorporar el archivo .gitignore para que .env y node_modules no se suban al repositorio

7. Estructurar carpetas:
src/
├─ config/          (environment.js: expone la URL del Backend desde .env)
├─ constants/       (Roles de Miembro: Dueño/Usuario)
├─ context/         (AuthContext, WorkspacesContext)
├─ hooks/           (useForm, useRequest)
├─ services/        (authService, workspaceService, messageService: fetch al Backend)
├─ middlewares/     (AuthMiddleware, AlreadyAuthMiddleware)
├─ Screens/         (Login, RegisterScreen, RegisterSuccess, VerifySuccess, VerifyError, Loading, Home)
├─ Components/      (Sidebar, Menu, Chat, Profile, AddEmoji, DescargarApp)
├─ Styles/          (App, Chat, HomeScreen, Login, Menu, Profile, Sidebar, Loading)
├─ assets/
├─ App.jsx          (Rutas + Dark Mode global)
└─ main.jsx         (Punto de entrada, BrowserRouter)

MANEJO DE HTML, CSS Y JAVASCRIPT (INTERFAZ WHATSAPP)

1. Maquetar la interfaz replicando la app real de WhatsApp Web: Barra lateral de iconos (Sidebar), listado de chats (Menu) y ventana de conversación (Chat), separados en tres columnas
2. Dividir la maquetación en Componentes reutilizables de React (.jsx), con sus hojas de estilos propia dentro de src/Styles
3. Definir variables globales de color en :root dentro de App.css (verdes y grises institucionales de WhatsApp), para reutilizarlas en todos los componentes en lugar de repetir código

Ejemplo de variables en App.css:

 :root {
    --background-white: #FAFAFA;
    --light-green: #25D366;
    --soft-green: #D9FDD3;
    --dark-green: #15603E;
    --border-grey: #C5C4C3;
 }

4. Incorporar el componente Sidebar.jsx con los íconos de navegación (Chats, Estados, Comunidades, Ajustes)
5. Incorporar el componente Menu.jsx con el listado de Espacios de Trabajo/Chats del Usuario, buscador y botón de 'Modo Oscuro'
6. Incorporar el componente Chat.jsx con: Header (nombre y datos del contacto/grupo), cuerpo de mensajes (recibidos/enviados) e input de texto con botón de enviar
7. Incorporar el componente AddEmoji.jsx utilizando la librería emoji-picker-react para adjuntar emojis al mensaje antes de enviarlo
8. Incorporar el componente Profile.jsx para visualizar los datos del Usuario logueado (obtenidos desde el AuthContext) y cerrar sesión
9. Incorporar el componente DescargarApp.jsx como pantalla de bienvenida (Visible cuando no hay ningún chat abierto)
10. Diferenciar visualmente los mensajes propios de los mensajes recibidos comparando el fk_user_id del mensaje contra el id del Usuario logueado (JWT decodificado)

RESPONSIVE

1. Definir breakpoints mediante @media queries en App.css para adaptar la interfaz a distintos tamaños de pantalla:


 **CELULAR:** @media (max-width: 600px)
 **TABLET CHICA:** @media (min-width: 600px) and (max-width: 700px)
 **TABLET MEDIANA:** @media (min-width: 700px) and (max-width: 880px)
 **NOTEBOOK:** @media (min-width: 880px) and (max-width: 1200px)
 **DESKTOP:** @media (min-width: 1200px)
 **DESKTOP GRANDE:** @media (min-width: 1600px)

2. Incorporar en Home.jsx el estado anchoVentana mediante window.innerWidth, actualizado con un listener del evento 'resize'
3. Calcular banderas booleanas (esMobile, esTabletChico, esTabletGrande, esDesktop) en base al ancho de pantalla actual
4. Ocultar Y mostrar condicionalmente el Sidebar, el Menu y el Chat según el dispositivo y la vista activa (vistaActiva: "menu" | "chat"), para lograr un comportamiento de navegación tipo aplicación móvil (una sola columna visible) en Mobile/Tablet chica, y de tres columnas simultáneas en Desktop

Ejemplo de lógica en Home.jsx:

 const esMobile = anchoVentana < 600
 const menuOculto = (esMobile || esTabletChico) && vistaActiva === "chat"
 const mainOculto = (esMobile || esTabletChico) && vistaActiva === "menu"
 const sidebarOculto = esMobile

5. Incorporar la función volverAlMenu(), disparada por un botón "volver" (flecha) dentro del Chat, visible únicamente en las vistas Mobile/Tablet, para regresar al listado de chats

MODO CLARO Y MODO OSCURO

1. Incorporar el estado darkMode (useState) en App.jsx, como estado global de la aplicación
2. Aplicar condicionalmente la clase 'dark-mode' al contenedor raíz ('app') y propagar la prop darkMode/onToggleDarkMode a Home.jsx y de ahí a Menu.jsx
3. Incorporar el botón de alternancia (toggle) dentro de Menu.jsx, que ejecuta onToggleDarkMode para invertir el estado
4. Sobrescribir estilos por componente utilizando el selector descendiente '.dark-mode' antes de cada clase, en lugar de duplicar componentes, para mantener el modo oscuro centralizado en un único estado

Ejemplo en Chat.css:

 .chat-header { background-color: var(--background-white); }
 .dark-mode .chat-header { background-color: var(--background-dark_grey); }

5. Repetir el mismo criterio en las hojas de estilo de Sidebar, Menu, Chat y Profile, para que toda la interfaz (textos, íconos svg, inputs, burbujas de mensaje) responda al cambio de modo

CONEXIÓN CON BACKEND

1. Incorporar la carpeta config/ con el archivo environment.js para exponer la URL del Backend desde la variable de entorno VITE_URL_API (ocultando la URL "hardcodeada" del código fuente)
2. Incorporar la carpeta services/ como única capa de comunicación HTTP con la API (authService, workspaceService, messageService), replicando en el cliente los mismos endpoints documentados en el Backend
3. Incorporar el hook useRequest.jsx para centralizar el manejo de los tres estados de una consulta asíncrona (loading, response, error) y evitar repetir try/catch en cada componente

Ejemplo de uso de useRequest:

 const { sendRequest, loading, error } = useRequest()
 sendRequest(() => login(email, password))

4. Incorporar el hook useForm.jsx para centralizar el manejo de formularios controlados (formState, handleChange, handleSubmit)
5. Incorporar la función getAuthHeaders() dentro de workspaceService y messageService, para adjuntar el header Authorization: Bearer <access_token> en cada petición que requiera sesión iniciada
6. Incorporar la función localStorage.setItem/getItem/removeItem (clave 'auth_token') para persistir el access_token entregado por el Backend tras el Login
7. Instalar la librería 'jwt-decode' para decodificar el payload del token en el cliente (sin validar la firma) y así extraer id, nombre, email y fecha_creacion del Usuario logueado, sin necesidad de otra consulta al Backend

RUTAS Y AUTENTICACIÓN (React Router)

1. Instalar 'react-router-dom' y envolver la aplicación en un BrowserRouter (main.jsx)
2. Creación del componente AuthContext.jsx: guarda isLogged y userData, expone las funciones login() y logout()
3. Incorporar el componente AuthContext a la App.jsx de manera global (AuthContextProvider envolviendo <Routes>)
4. Incorporar el archivo AuthMiddleware.jsx: si no hay sesión iniciada (isLogged === false), que redirige a /login (Caso contrario, renderiza la ruta protegida (<Outlet/>))
5. Incorporar el archivo AlreadyAuthMiddleware.jsx: si el Usuario ya tiene sesión iniciada e intenta entrar a /login o /register, lo redirige directamente a /home
6. Incorporar el componente WorkspacesContext.jsx: al ingresar a /home, que trae automáticamente los Espacios de Trabajo (getWorkspaces) y las invitaciones pendientes (getMyPendingInvitations) del Usuario, y centraliza las funciones para crear, editar, eliminar, invitar, abandonar, aceptar y rechazar

ENDPOINTS UTILIZADOS DESDE EL FRONTEND

**authService.js**
(POST) /api/auth/register
(POST) /api/auth/login

**workspaceService.js**
(GET)    /api/workspace
(POST)   /api/workspace
(PUT)    /api/workspace/:workspace_id
(DELETE) /api/workspace/:workspace_id
(GET)    /api/workspace/members/me/invitations
(PUT)    /api/workspace/:workspace_id/members/me/:decision
(GET)    /api/workspace/:workspace_id/members
(POST)   /api/workspace/:workspace_id/members
(DELETE) /api/workspace/:workspace_id/members/me

**messageService.js**
(GET)  /api/messages/:workspace_id
(GET)  /api/messages/:workspace_id/new?after=
(POST) /api/messages/:workspace_id

DESPLIEGUE

1. Conectar el Frontend con el host de Vercel
2. Incorporar el archivo vercel.json en la carpeta del Frontend, con un rewrite de todas las rutas hacia /index.html (necesario para que React Router funcione correctamente al recargar una ruta protegida)

 {
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
 }

3. Configurar la variable de entorno VITE_URL_API en el panel de Vercel, apuntando a la URL del Backend ya desplegado
4. Ejecutar npm run build para generar la carpeta de producción y desplegarla

DEPLOY final:

Backend: https://whats-app-final-project-4e19ivwjy.vercel.app/
Frontend: https://whats-app-frontend-final.vercel.app/login