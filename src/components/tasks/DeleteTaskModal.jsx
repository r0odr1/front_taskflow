import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

import { deleteTask } from '../../services/taskService.js';

/**
 * Solicita confirmación antes de eliminar una tarea.
 */
function DeleteTaskModal({ task, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && !deleting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, deleting]);

  const handleDelete = async () => {
    if (deleting) return;

    setError('');
    setDeleting(true);

    try {
      await deleteTask(task.id);
      onDeleted();
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible eliminar la tarea.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="project-modal-overlay">
      <section
        className="project-modal task-delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-task-title"
        aria-describedby="delete-task-description"
      >
        <div className="project-modal-header">
          <div className="task-delete-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="project-modal-close"
            onClick={onClose}
            disabled={deleting}
            aria-label="Cerrar confirmación"
          >
            <X size={20} />
          </button>
        </div>

        <h2 id="delete-task-title">
          Eliminar tarea
        </h2>

        <p
          id="delete-task-description"
          className="task-delete-description"
        >
          ¿Estás seguro de eliminar la tarea{' '}
          <strong>{task.titulo}</strong>?
          Esta acción es permanente y no se puede deshacer.
        </p>

        {error && (
          <p className="project-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="project-modal-actions">
          <button
            type="button"
            className="btn secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn task-delete-confirm"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={16} />
            {deleting
              ? 'Eliminando...'
              : 'Eliminar definitivamente'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteTaskModal;
