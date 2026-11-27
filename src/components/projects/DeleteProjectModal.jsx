import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

import { deleteProject } from '../../services/projectService.js';

/**
 * Confirmación de eliminación de un proyecto.
 */
function DeleteProjectModal({ project, onClose, onDeleted }) {
  const [confirmation, setConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const isConfirmed = confirmation === project.nombre;

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

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!isConfirmed || deleting) return;

    setError('');
    setDeleting(true);

    try {
      await deleteProject(project.id);
      onDeleted();
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible eliminar el proyecto.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="project-modal-overlay">
      <section
        className="project-modal project-delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        aria-describedby="delete-project-description"
      >
        <div className="project-modal-header">
          <div className="project-delete-icon">
            <AlertTriangle size={25} />
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

        <h2 id="delete-project-title">
          Eliminar proyecto
        </h2>

        <p
          id="delete-project-description"
          className="project-delete-description"
        >
          Estás a punto de eliminar el proyecto
          {' '}<strong>{project.nombre}</strong>.
          Esta acción también eliminará sus tareas
          asociadas y no se puede deshacer.
        </p>

        <form onSubmit={handleDelete}>
          <div className="project-form-field">
            <label htmlFor="project-delete-confirmation">
              Escribe el nombre exacto del proyecto para confirmar:
            </label>

            <input
              id="project-delete-confirmation"
              type="text"
              value={confirmation}
              onChange={(event) =>
                setConfirmation(event.target.value)
              }
              placeholder={project.nombre}
              autoComplete="off"
              disabled={deleting}
              autoFocus
            />
          </div>

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
              type="submit"
              className="btn project-delete-confirm"
              disabled={!isConfirmed || deleting}
            >
              <Trash2 size={16} />
              {deleting
                ? 'Eliminando...'
                : 'Eliminar definitivamente'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default DeleteProjectModal;