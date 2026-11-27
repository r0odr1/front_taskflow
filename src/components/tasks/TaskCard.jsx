import { CalendarDays, FolderKanban, UserRound } from 'lucide-react';

/**
 * Tarjeta de tarea dentro del tablero Kanban.
 */
function TaskCard({ task }) {
  const formatDate = (value) => {
    if (!value) return 'Sin fecha';

    const [year, month, day] = String(value)
      .slice(0, 10)
      .split('-')
      .map(Number);

    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));
  };

  const priorityLabels = {
    BAJA: 'Baja',
    MEDIA: 'Media',
    ALTA: 'Alta',
  };

  return (
    <article className="task-card">
      <div className="task-card-header">
        <span
          className={`task-priority task-priority-${task.prioridad?.toLowerCase()}`}
        >
          {priorityLabels[task.prioridad] || task.prioridad}
        </span>

        <span className="task-id">#{task.id}</span>
      </div>

      <h3>{task.titulo}</h3>

      <p className="task-card-description">
        {task.descripcion || 'Sin descripción registrada.'}
      </p>

      <div className="task-card-info">
        <div>
          <FolderKanban size={15} />
          <span>{task.proyecto || 'Sin proyecto'}</span>
        </div>

        <div>
          <UserRound size={15} />
          <span>{task.asignado || 'Sin asignar'}</span>
        </div>

        <div>
          <CalendarDays size={15} />
          <span>{formatDate(task.fecha_limite)}</span>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;