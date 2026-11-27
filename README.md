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

### Configuración local

Para ejecutar TaskFlow, es necesario tener configurados
y en funcionamiento el backend y la base de datos PostgreSQL.

El frontend requiere configurar localmente la variable
`VITE_API_URL` con la dirección de la API REST.

Las credenciales y demás valores privados de configuración
no se incluyen en el repositorio.

### Iniciar la aplicación

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

Abrir la dirección local indicada por Vite,
normalmente:

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

- **Interfaz de autenticación:** diseño Liquid Glass adaptable a diferentes pantallas, con controles para mostrar y ocultar la contraseña.
- **Títulos dinámicos:** actualización automática del título de la pestaña según la sección activa mediante React Router.

- **Consulta de proyectos:** listado de proyectos accesibles al usuario autenticado mediante la API REST.
  - Visualización de proyectos mediante tarjetas.
  - Información de nombre, descripción, propietario y fechas.
  - Búsqueda de proyectos por nombre.
  - Manejo de estados de carga, errores y ausencia de información.

- **Creación de proyectos:** registro de nuevos proyectos desde un formulario modal.
  - Integración con `POST /api/proyectos`.
  - Validación de nombre, descripción y fechas.
  - Manejo de errores y estado de guardado.
  - Actualización automática del listado después del registro.

- **Detalle de proyectos:** consulta individual mediante `GET /api/proyectos/:id`.
  - Navegación desde las tarjetas del listado.
  - Visualización de información general, propietario y fechas.
  - Consulta de tareas asociadas mediante `GET /api/tareas?proyecto_id=...`.
  - Indicadores de tareas totales, en progreso y completadas.
  - Cálculo automático del porcentaje de avance.
  - Manejo de proyectos inexistentes, errores y estados de carga.

- **Edición de proyectos:** modificación de proyectos propios mediante `PUT /api/proyectos/:id`.
  - Reutilización del formulario modal de creación y edición.
  - Precarga de la información existente.
  - Validación de campos y fechas.
  - Control de acceso según el propietario del proyecto.
  - Actualización automática del detalle después de guardar.


- **Eliminación de proyectos:** eliminación de proyectos propios mediante `DELETE /api/proyectos/:id`.
  - Confirmación mediante formulario modal.
  - Validación del nombre exacto del proyecto.
  - Advertencia sobre la eliminación de tareas asociadas.
  - Restricción de la operación al propietario.
  - Redirección automática al listado después de eliminar.
  - Manejo de errores del servidor.

### Pendientes
- Gestión de tareas y tablero Kanban.
- Calendario de actividades.
- Gestión de equipos.
- Perfil de usuario y ajustes.
- Despliegue de la aplicación.


**Estado:** frontend en desarrollo, con autenticación JWT,
Dashboard conectado a la API REST y CRUD de proyectos
implementado. Pendiente completar la gestión de tareas
y las funcionalidades adicionales.

## Backend

El frontend consume una API REST desarrollada con Node.js, Express y PostgreSQL. La autenticación utiliza JWT y las operaciones de proyectos y tareas se realizan mediante peticiones HTTP con Axios. Los endpoints están documentados con Swagger.

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