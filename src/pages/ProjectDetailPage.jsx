import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FolderKanban,
  UserRound,
} from 'lucide-react';

import { getProjectById } from '../services/projectService.js';
import { getTasksByProject } from '../services/taskService.js';
import { Pencil } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import ProjectFormModal from '../components/projects/ProjectFormModal.jsx';
import { Trash2 } from 'lucide-react';
import DeleteProjectModal from '../components/projects/DeleteProjectModal.jsx';

import '../styles/projects.css';

const STATUS_LABELS = {
  PENDIENTE: 'Por hacer',
  EN_PROGRESO: 'En curso',
  EN_REVISION: 'En revisión',
  COMPLETADA: 'Completada',
};

const PRIORITY_LABELS = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
};

function formatDate(value) {
  if (!value) return 'Sin definir';

  const datePart = String(value).slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);

  if (!year || !month || !day) return 'Sin definir';

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const invalidId = !Number.isSafeInteger(projectId) || projectId <= 0;

  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(!invalidId);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (invalidId) return;

    const controller = new AbortController();

    async function loadProject() {
      try {
        setLoading(true);
        setError('');
        const projectData = await getProjectById(
          projectId,
          controller.signal
        );

        // Solo consultamos tareas cuando el proyecto es accesible.
        const taskData = await getTasksByProject(
          projectId,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setProject(projectData);
          setTasks(taskData);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err.response?.status === 404) {
          setError('El proyecto no existe o no tienes acceso.');
        } else if (err.response?.status === 401) {
          setError('Tu sesión ha expirado. Inicia sesión nuevamente.');
        } else {
          setError('No fue posible consultar el proyecto.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProject();

    return () => controller.abort();
  }, [projectId, invalidId, refreshKey]);

  const handleProjectUpdated = () => {
    setShowEditModal(false);
    setRefreshKey((previous) => previous + 1);
  };

  const handleProjectDeleted = () => {
    setShowDeleteModal(false);
    navigate('/proyectos', { replace: true });
  };

  // El backend también verifica la propiedad del proyecto.
  const canEdit =
    project &&
    (project.es_propietario === true ||
      Number(project.propietario_id) === Number(user?.id));

  if (invalidId || error) {
    return (
      <section className="panel project-detail-message" role="alert">
        <h2>No se pudo mostrar el proyecto</h2>
        <p className="sub">
          {invalidId ? 'El identificador no es válido.' : error}
        </p>
        <Link to="/proyectos" className="btn project-detail-link">
          Volver a proyectos
        </Link>
      </section>
    );
  }

  if (loading || !project) {
    return (
      <section className="panel" role="status">
        Cargando información del proyecto...
      </section>
    );
  }

  const completed = tasks.filter((task) => task.estado === 'COMPLETADA').length;

  const inProgress = tasks.filter((task) => task.estado === 'EN_PROGRESO').length;

  const total = tasks.length;

  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0;

  return (
    <>
      <Link to="/proyectos" className="project-back-link">
        <ArrowLeft size={17} />
        Volver a proyectos
      </Link>

      <div className="pagehead">
        <div>
          <h1>{project.nombre}</h1>
          <p className="sub">
            Información y seguimiento del proyecto.
          </p>
        </div>
        
        <div className="project-detail-actions">
          <span className="tag">Proyecto #{project.id}</span>

          {canEdit && (
            <button
              type="button"
              className="btn project-edit-button"
              onClick={() => setShowEditModal(true)}
            >
              <Pencil size={17} />
              Editar proyecto
            </button>
          )}

          {canEdit && (
            <button
              type="button"
              className="btn project-delete-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={17} />
              Eliminar proyecto
            </button>
          )}
        </div>
      </div>

      <section className="panel project-detail-overview">
        <div className="project-detail-heading">
          <FolderKanban size={24} />
          <h2>Información general</h2>
        </div>

        <p className="project-detail-description">
          {project.descripcion || 'Sin descripción registrada.'}
        </p>

        <div className="project-detail-info">
          <div>
            <UserRound size={18} />
            <span>
              <small>Propietario</small>
              <strong>{project.propietario}</strong>
            </span>
          </div>

          <div>
            <CalendarDays size={18} />
            <span>
              <small>Fecha de inicio</small>
              <strong>{formatDate(project.fecha_inicio)}</strong>
            </span>
          </div>

          <div>
            <CalendarDays size={18} />
            <span>
              <small>Fecha de finalización</small>
              <strong>{formatDate(project.fecha_fin)}</strong>
            </span>
          </div>
        </div>
      </section>

      <div className="project-detail-stats">
        <div className="panel">
          <ClipboardList size={24} />
          <span>Total de tareas</span>
          <strong>{total}</strong>
        </div>

        <div className="panel">
          <Clock3 size={24} />
          <span>En progreso</span>
          <strong>{inProgress}</strong>
        </div>

        <div className="panel">
          <CheckCircle2 size={24} />
          <span>Completadas</span>
          <strong>{completed}</strong>
        </div>
      </div>

      <section className="panel project-detail-progress">
        <h2>Progreso del proyecto</h2>

        <div className="project-progress-header">
          <strong>{percentage}%</strong>
          <span>
            {completed} de {total} tareas completadas
          </span>
        </div>

        <div
          className="bar"
          role="progressbar"
          aria-label="Progreso del proyecto"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <b style={{ width: `${percentage}%` }} />
        </div>
      </section>

      <section className="panel project-detail-tasks">
        <h2>Tareas del proyecto</h2>

        {total === 0 ? (
          <p className="sub">
            Este proyecto todavía no tiene tareas registradas.
          </p>
        ) : (
          <div className="project-task-list">
            {tasks.map((task) => (
              <article className="project-task-item" key={task.id}>
                <div>
                  <strong>{task.titulo}</strong>
                  <p className="sub">
                    {task.descripcion || 'Sin descripción'}
                  </p>
                </div>

                <div className="project-task-meta">
                  <span className="tag">
                    {STATUS_LABELS[task.estado] || task.estado}
                  </span>

                  <span>
                    Prioridad: {
                      PRIORITY_LABELS[task.prioridad] || task.prioridad
                    }
                  </span>

                  <span>
                    Responsable: {task.asignado || 'Sin asignar'}
                  </span>

                  <span>
                    Vence: {formatDate(task.fecha_limite)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showEditModal && (
        <ProjectFormModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSaved={handleProjectUpdated}
        />
      )}

      {showDeleteModal && (
        <DeleteProjectModal
          project={project}
          onClose={() => setShowDeleteModal(false)}
          onDeleted={handleProjectDeleted}
        />
      )}
    </>
  );
}

export default ProjectDetailPage;