import { CalendarDays, FolderKanban, Pencil, Trash2, UserRound } from 'lucide-react';

/**
 * Tarjeta de tarea dentro del tablero Kanban.
 */
function TaskCard({ task, onEdit, onDelete, onStatusChange, updating = false, }) {
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

  const statusOptions = [
    { value: 'PENDIENTE', label: 'Por hacer' },
    { value: 'EN_PROGRESO', label: 'En progreso' },
    { value: 'EN_REVISION', label: 'En revisión' },
    { value: 'COMPLETADA', label: 'Completada' },
  ];

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
      
      {(onEdit || onDelete) && (
        <div className="task-card-actions">
          {onEdit && (
            <button
              type="button"
              className="task-card-edit"
              onClick={() => onEdit(task)}
              disabled={updating}
              aria-label={`Editar tarea ${task.titulo}`}
            >
              <Pencil size={14} />
              Editar tarea
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="task-card-delete"
              onClick={() => onDelete(task)}
              disabled={updating}
              aria-label={`Eliminar tarea ${task.titulo}`}
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          )}
        </div>
      )}

      {onStatusChange && (
        <div className="task-status-control">
          <label htmlFor={`task-status-${task.id}`}>
            Estado
          </label>

          <select
            id={`task-status-${task.id}`}
            value={task.estado}
            disabled={updating}
            onChange={(event) =>
              onStatusChange(task, event.target.value)
            }
            aria-label={`Cambiar estado de ${task.titulo}`}
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          {updating && (
            <span className="task-status-saving" role="status">
              Guardando...
            </span>
          )}
        </div>
      )}

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