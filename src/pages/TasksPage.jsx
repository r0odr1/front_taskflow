import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, RefreshCw, Search } from 'lucide-react';

import TaskCard from '../components/tasks/TaskCard.jsx';
import { getTasks } from '../services/taskService.js';
import { getProjects } from '../services/projectService.js';
import {
  initialTasksState,
  tasksReducer,
} from '../reducers/tasksReducer.js';
import { useAuth } from '../hooks/useAuth.js';
import TaskFormModal from '../components/tasks/TaskFormModal.jsx';

import '../styles/tasks.css';

const columns = [
  {
    status: 'PENDIENTE',
    title: 'Por hacer',
  },
  {
    status: 'EN_PROGRESO',
    title: 'En progreso',
  },
  {
    status: 'EN_REVISION',
    title: 'En revisión',
  },
  {
    status: 'COMPLETADA',
    title: 'Completadas',
  },
];

/**
 * Tablero de tareas con filtros y estado centralizado.
 */
function TasksPage() {
  const [state, dispatch] = useReducer(
    tasksReducer,
    initialTasksState
  );

  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const ownedProjects = state.projects.filter(
    (project) => Number(project.propietario_id) === Number(user?.id)
  );

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        dispatch({ type: 'LOAD_START' });

        const [tasks, projects] = await Promise.all([
          getTasks(controller.signal),
          getProjects(controller.signal),
        ]);

        if (controller.signal.aborted) return;

        dispatch({
          type: 'LOAD_SUCCESS',
          payload: { tasks, projects },
        });
      } catch (err) {
        if (controller.signal.aborted) return;

        dispatch({
          type: 'LOAD_ERROR',
          payload:
            err.response?.status === 401
              ? 'Tu sesión ha expirado. Inicia sesión nuevamente.'
              : 'No fue posible consultar las tareas.',
        });
      }
    }

    loadData();

    return () => controller.abort();
  }, [refreshKey]);

  const filteredTasks = state.tasks.filter((task) => {
    const matchesSearch = task.titulo
      .toLowerCase()
      .includes(state.search.trim().toLowerCase());

    const matchesProject = state.selectedProject === 'all' || String(task.proyecto_id) === state.selectedProject;

    return matchesSearch && matchesProject;
  });

  const handleRefresh = () => {
    setRefreshKey((previous) => previous + 1);
  };

  const handleTaskCreated = () => {
    setShowCreateModal(false);

    // Mostramos la tarea creada, independientemente del proyecto seleccionado anteriormente.
    dispatch({
      type: 'SET_PROJECT',
      payload: 'all',
    });

    dispatch({
      type: 'SET_SEARCH',
      payload: '',
    });

    handleRefresh();
  };

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Mis tareas</h1>
          <p className="sub">
            Organiza y consulta las tareas de tus proyectos.
          </p>
        </div>

        <div className="tasks-header-actions">
          <span className="tasks-total">
            <ClipboardList size={18} />
            {filteredTasks.length} tareas
          </span>

          <button
            type="button"
            className="btn tasks-create-button"
            onClick={() => setShowCreateModal(true)}
            disabled={state.loading || ownedProjects.length === 0}
            title={
              ownedProjects.length === 0
                ? 'Necesitas ser propietario de un proyecto'
                : 'Crear una nueva tarea'
            }
          >
            <Plus size={18} />
            Nueva tarea
          </button>
        </div>
      </div>

      <div className="tasks-toolbar">
        <label className="tasks-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Buscar tareas..."
            aria-label="Buscar tareas"
            value={state.search}
            onChange={(event) =>
              dispatch({
                type: 'SET_SEARCH',
                payload: event.target.value,
              })
            }
          />
        </label>

        <select
          className="tasks-project-filter"
          aria-label="Filtrar tareas por proyecto"
          value={state.selectedProject}
          onChange={(event) =>
            dispatch({
              type: 'SET_PROJECT',
              payload: event.target.value,
            })
          }
        >
          <option value="all">Todos los proyectos</option>

          {state.projects.map((project) => (
            <option key={project.id} value={String(project.id)}>
              {project.nombre}
            </option>
          ))}
        </select>

        <button
          className="btn secondary tasks-refresh"
          type="button"
          onClick={handleRefresh}
          disabled={state.loading}
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </div>

      {state.loading && (
        <section className="panel" role="status">
          Cargando tareas...
        </section>
      )}

      {!state.loading && state.error && (
        <section className="panel" role="alert">
          <h2>No fue posible cargar las tareas</h2>
          <p className="sub">{state.error}</p>

          <button
            className="btn tasks-refresh"
            type="button"
            onClick={handleRefresh}
          >
            Reintentar
          </button>
        </section>
      )}

      {!state.loading && !state.error && (
        <>
          {filteredTasks.length === 0 && (
            <section className="panel tasks-empty">
              <ClipboardList size={35} />

              <h2>No hay tareas para mostrar</h2>

              <p className="sub">
                {state.tasks.length === 0
                  ? 'Aún no hay tareas registradas en tus proyectos.'
                  : 'No hay tareas que coincidan con los filtros.'}
              </p>

              {state.projects.length === 0 && (
                <Link to="/proyectos" className="tasks-projects-link">
                  Ir a proyectos
                </Link>
              )}
            </section>
          )}

          <div className="tasks-board">
            {columns.map((column) => {
              const columnTasks = filteredTasks.filter(
                (task) => task.estado === column.status
              );

              return (
                <section
                  className={`tasks-column tasks-column-${column.status.toLowerCase()}`}
                  key={column.status}
                >
                  <div className="tasks-column-header">
                    <h2>{column.title}</h2>
                    <span>{columnTasks.length}</span>
                  </div>

                  <div className="tasks-column-content">
                    {columnTasks.length === 0 ? (
                      <p className="tasks-column-empty">
                        Sin tareas
                      </p>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      {showCreateModal && (
        <TaskFormModal
          projects={ownedProjects}
          initialProjectId={
            state.selectedProject !== 'all' &&
            ownedProjects.some(
              (project) =>
                String(project.id) === state.selectedProject
            )
              ? state.selectedProject
              : ''
          }
          onClose={() => setShowCreateModal(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </>
  );
}

export default TasksPage;