# TaskFlow — Frontend

Aplicación web desarrollada con React para la gestión de proyectos y tareas. Permite organizar actividades, consultar su progreso y administrar el trabajo mediante una interfaz visual e intuitiva.

Este proyecto forma parte del desarrollo académico de la asignatura **Electiva — Desarrollo de Aplicaciones Web**.

## Tecnologías

- React 19
- Vite 8
- JavaScript (JSX)
- React Router DOM
- Axios
- CSS3
- ESLint

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/r0odr1/front_taskflow.git
```

Acceder a la carpeta e instalar las dependencias:

```bash
cd front_taskflow
npm install
```

## Ejecución

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir la dirección local indicada por Vite, normalmente:

http://localhost:5173

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la versión de producción. |
| `npm run preview` | Permite visualizar la compilación de producción. |
| `npm run lint` | Verifica el código mediante ESLint. |

## Estructura del proyecto

```text
src/
├── components/    # Componentes reutilizables
├── context/       # Estado global y autenticación
├── pages/         # Pantallas de la aplicación
├── routes/        # Configuración de navegación
├── services/      # Comunicación con la API REST
├── styles/        # Estilos globales y visuales
├── App.jsx        # Componente principal
└── main.jsx       # Punto de entrada
```

La estructura se completará progresivamente durante el desarrollo.

## Funcionalidades

### Implementadas

- **Autenticación:** inicio y cierre de sesión mediante JWT.
- **Rutas protegidas:** acceso restringido a usuarios autenticados.
- **Gestión de sesión:** recuperación de sesión mediante Context API.
- **Navegación:** menú lateral y encabezado reutilizables con React Router.
- **Dashboard:** consulta de proyectos y tareas desde la API REST.
  - Indicadores de tareas totales, en progreso, en revisión y completadas.
  - Porcentaje de cumplimiento.
  - Gráfica de distribución de tareas por estado.
  - Listado de próximas tareas y actividades recientes.
  - Manejo de estados de carga, errores y ausencia de información.

### Pendientes

- Gestión de proyectos desde el frontend.
- Gestión de tareas y tablero Kanban.
- Calendario de actividades.
- Gestión de equipos.
- Perfil de usuario y ajustes.
- Despliegue de la aplicación.

**Estado:** frontend en desarrollo, conectado al backend mediante Axios y autenticación JWT.

La aplicación contempla los siguientes módulos:

- Autenticación y gestión de sesiones.
- Dashboard de seguimiento.
- Administración de proyectos.
- Gestión de tareas y tablero Kanban.
- Calendario de actividades.
- Perfil de usuario.

**Estado:** frontend en desarrollo. La estructura inicial con React y Vite está configurada y se está incorporando la navegación y el diseño visual.

## Backend

El frontend consumirá una API REST desarrollada con Node.js, Express y PostgreSQL, utilizando JWT para la autenticación.

Repositorio:

https://github.com/r0odr1/back_taskflow

## Diseño

La interfaz reutiliza y adapta el prototipo desarrollado previamente en HTML, CSS y JavaScript, tomando como referencia el diseño realizado en Figma.

Prototipo original:

https://github.com/r0odr1/taskflowDis/tree/dev

## Proyecto académico

**TaskFlow** busca facilitar la organización y el seguimiento de proyectos y tareas mediante tecnologías modernas de desarrollo web, aplicando componentes reutilizables, navegación, consumo de servicios REST y buenas prácticas de desarrollo.

## Autoría y derechos de autor

**Desarrollado por:** Rodrigo Hernando Bonilla Torres  
**Proyecto:** TaskFlow  
**Año:** 2026

© 2026 Rodrigo Hernando Bonilla Torres. Todos los derechos reservados.

Este proyecto fue desarrollado con fines académicos como parte de la asignatura *Electiva — Desarrollo de Aplicaciones Web*. Su código fuente, diseño e implementación forman parte del trabajo realizado por el autor, con reutilización de recursos y tecnologías de terceros conforme a sus respectivas licencias.