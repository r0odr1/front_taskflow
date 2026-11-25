import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock3,
  ListChecks,
  CheckCircle2,
  FolderKanban,
  RefreshCw,
} from 'lucide-react';

import StatCard from '../components/dashboard/StatCard.jsx';
import TaskStatusChart from '../components/dashboard/TaskStatusChart.jsx';
import { getDashboardData } from '../services/dashboardService.js';

import '../styles/dashboard.css';

const STATUS_LABELS = {
  PENDIENTE: 'Por hacer',
  EN_PROGRESO: 'En curso',
  EN_REVISION: 'En revisión',
  COMPLETADA: 'Completada',
};

function formatDate(value) {
  if (!value) return 'Sin fecha';

  // Evita desplazamientos de día por zona horaria.
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);

  if (!year || !month || !day) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        const result = await getDashboardData(controller.signal);

        if (!controller.signal.aborted) {
          setProjects(result.projects);
          setTasks(result.tasks);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err.response?.status === 401
            ? 'Tu sesión expiró. Cierra sesión e ingresa nuevamente.'
            : 'No fue posible cargar el Dashboard. Verifica la conexión con el servidor.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="panel" role="status">
        Cargando información del Dashboard...
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel" role="alert">
        <h2>No se pudo cargar el Dashboard</h2>
        <p className="sub">{error}</p>
        <button
          className="btn dashboard-retry"
          onClick={() => window.location.reload()}
          type="button"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      </section>
    );
  }

  const total = tasks.length;
  const inProgress = tasks.filter((task) => task.estado === 'EN_PROGRESO').length;
  const inReview = tasks.filter((task) => task.estado === 'EN_REVISION').length;
  const completed = tasks.filter((task) => task.estado === 'COMPLETADA').length;

  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0;

  const stats = [
    {
      title: 'Tareas totales',
      value: total,
      icon: ClipboardList,
      color: 'blue',
      description: 'Tareas registradas',
    },
    {
      title: 'En progreso',
      value: inProgress,
      icon: Clock3,
      color: 'cyan',
      description: 'Tareas activas',
    },
    {
      title: 'En revisión',
      value: inReview,
      icon: ListChecks,
      color: 'violet',
      description: 'Pendientes de revisión',
    },
    {
      title: 'Completadas',
      value: completed,
      icon: CheckCircle2,
      color: 'green',
      description: `${percentage}% de cumplimiento`,
    },
  ];

  const upcomingTasks = tasks
    .filter((task) => task.estado !== 'COMPLETADA' && task.fecha_limite)
    .sort((a, b) => a.fecha_limite.localeCompare(b.fecha_limite))
    .slice(0, 3);

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Dashboard</h1>
          <p className="sub">
            Aquí tienes un resumen del progreso de tus proyectos.
          </p>
        </div>

        <Link className="btn dashboard-action" to="/tareas">
          <ClipboardList size={18} />
          Ver tareas
        </Link>
      </div>

      <div className="statgrid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="layout2 dashboard-panels">
        <section className="panel">
          <h2>Progreso de tareas</h2>
          <p className="sub">Porcentaje de tareas completadas</p>

          <div className="dashboard-progress-value">
            <strong>{percentage}%</strong>
            <span>{completed} de {total} tareas completadas</span>
          </div>

          <div
            className="bar dashboard-progress"
            role="progressbar"
            aria-label="Porcentaje de tareas completadas"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <b style={{ width: `${percentage}%` }} />
          </div>

          {total === 0 && (
            <p className="sub dashboard-empty">
              Todavía no hay tareas registradas.
            </p>
          )}

          <div className="dashboard-project-info">
            <FolderKanban size={18} />
            <span>
              <strong>{projects.length}</strong> proyectos accesibles
            </span>
          </div>
        </section>

        <TaskStatusChart tasks={tasks} />
      </div>

      <section className="panel dashboard-section">
        <div className="dashboard-section-header">
          <h2>Próximas tareas</h2>
          <Link to="/tareas">Ver todas</Link>
        </div>

        {upcomingTasks.length === 0 ? (
          <p className="sub">
            No hay tareas pendientes con fecha límite.
          </p>
        ) : (
          upcomingTasks.map((task) => (
            <div className="listrow" key={task.id}>
              <div className="dashboard-task-details">
                <strong>{task.titulo}</strong>
                <span className="sub">
                  {task.proyecto || 'Proyecto sin nombre'}
                </span>
              </div>

              <div className="dashboard-task-meta">
                <span className="tag">
                  {STATUS_LABELS[task.estado] || task.estado}
                </span>
                <span>{formatDate(task.fecha_limite)}</span>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="panel dashboard-section">
        <div className="dashboard-section-header">
          <h2>Tareas registradas recientemente</h2>
          <Link to="/tareas">Ver todas</Link>
        </div>

        {recentTasks.length === 0 ? (
          <p className="sub">
            Aún no tienes tareas registradas.
          </p>
        ) : (
          recentTasks.map((task) => (
            <div className="feedrow" key={task.id}>
              <div className="dashboard-task-details">
                <strong>{task.titulo}</strong>
                <span className="sub">
                  {STATUS_LABELS[task.estado] || task.estado}
                </span>
              </div>

              <span>{formatDate(task.fecha_limite)}</span>
            </div>
          ))
        )}
      </section>
    </>
  );
}

export default DashboardPage;