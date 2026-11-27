import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { createTask } from '../../services/taskService.js';

const initialForm = {
  proyecto_id: '',
  titulo: '',
  descripcion: '',
  estado: 'PENDIENTE',
  prioridad: 'MEDIA',
  fecha_limite: '',
};

/**
 * Formulario para registrar tareas en proyectos propios.
 */
function TaskFormModal({
  projects,
  initialProjectId = '',
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    proyecto_id: initialProjectId
      ? String(initialProjectId)
      : String(projects[0]?.id ?? ''),
  }));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && !saving) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, saving]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError('');

    const titulo = form.titulo.trim();
    const projectId = Number(form.proyecto_id);

    if (!titulo) {
      setError('El título de la tarea es obligatorio.');
      return;
    }

    if (titulo.length > 150) {
      setError('El título no puede superar 150 caracteres.');
      return;
    }

    if (form.descripcion.length > 5000) {
      setError('La descripción no puede superar 5000 caracteres.');
      return;
    }

    if (!Number.isSafeInteger(projectId) || !projects.some((project) => Number(project.id) === projectId)) {
      setError('Selecciona un proyecto válido.');
      return;
    }

    const taskData = {
      proyecto_id: projectId,
      titulo,
      descripcion: form.descripcion.trim() || null,
      estado: form.estado,
      prioridad: form.prioridad,
      fecha_limite: form.fecha_limite || null,
      asignado_id: null,
    };

    setSaving(true);

    try {
      const task = await createTask(taskData);
      onCreated(task);
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible crear la tarea.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="project-modal-overlay">
      <section
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="project-modal-header">
          <div>
            <h2 id="task-modal-title">
              Nueva tarea
            </h2>

            <p className="sub">
              Registra una actividad dentro de un proyecto.
            </p>
          </div>

          <button
            type="button"
            className="project-modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="project-form-field">
            <label htmlFor="task-project">
              Proyecto *
            </label>

            <select
              id="task-project"
              name="proyecto_id"
              value={form.proyecto_id}
              onChange={handleChange}
              required
              disabled={saving}
            >
              <option value="">Seleccionar proyecto</option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="project-form-field">
            <label htmlFor="task-title">
              Título de la tarea *
            </label>

            <input
              id="task-title"
              name="titulo"
              type="text"
              value={form.titulo}
              onChange={handleChange}
              maxLength={150}
              required
              autoFocus
              placeholder="Ej. Implementar autenticación"
              disabled={saving}
            />
          </div>

          <div className="project-form-field">
            <label htmlFor="task-description">
              Descripción
            </label>

            <textarea
              id="task-description"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              maxLength={5000}
              rows={4}
              placeholder="Describe la actividad..."
              disabled={saving}
            />
          </div>

          <div className="task-form-grid">
            <div className="project-form-field">
              <label htmlFor="task-status">
                Estado
              </label>

              <select
                id="task-status"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="PENDIENTE">Por hacer</option>
                <option value="EN_PROGRESO">En progreso</option>
                <option value="EN_REVISION">En revisión</option>
                <option value="COMPLETADA">Completada</option>
              </select>
            </div>

            <div className="project-form-field">
              <label htmlFor="task-priority">
                Prioridad
              </label>

              <select
                id="task-priority"
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          <div className="project-form-field">
            <label htmlFor="task-deadline">
              Fecha límite
            </label>

            <input
              id="task-deadline"
              name="fecha_limite"
              type="date"
              value={form.fecha_limite}
              onChange={handleChange}
              disabled={saving}
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
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default TaskFormModal;