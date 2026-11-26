import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import {
  createProject,
  updateProject,
} from '../../services/projectService.js';

const initialForm = {
  nombre: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
};

function toDateInput(value) {
  return value ? String(value).slice(0, 10) : '';
}

/**
 * Formulario reutilizable para crear y editar proyectos.
 */
function ProjectFormModal({
  project = null,
  onClose,
  onSaved,
  onCreated,
}) {
  const isEditing = Boolean(project);

  const [form, setForm] = useState(() =>
    project
      ? {
          nombre: project.nombre ?? '',
          descripcion: project.descripcion ?? '',
          fecha_inicio: toDateInput(project.fecha_inicio),
          fecha_fin: toDateInput(project.fecha_fin),
        }
      : initialForm
  );

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

    const nombre = form.nombre.trim();

    if (!nombre) {
      setError('El nombre del proyecto es obligatorio.');
      return;
    }

    if (form.fecha_inicio && form.fecha_fin && form.fecha_fin < form.fecha_inicio) {
      setError('La fecha final no puede ser anterior a la inicial.');
      return;
    }

    const projectData = {
      nombre,
      descripcion: form.descripcion.trim() || null,
      fecha_inicio: form.fecha_inicio || null,
      fecha_fin: form.fecha_fin || null,
    };

    setSaving(true);

    try {
      const savedProject = isEditing
        ? await updateProject(project.id, projectData)
        : await createProject(projectData);

      if (onSaved) {
        onSaved(savedProject);
      } else if (onCreated) {
        onCreated(savedProject);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible guardar el proyecto.');
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
        aria-labelledby="project-modal-title"
      >
        <div className="project-modal-header">
          <div>
            <h2 id="project-modal-title">
              {isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}
            </h2>

            <p className="sub">
              {isEditing
                ? 'Modifica la información del proyecto.'
                : 'Completa la información para crear un proyecto.'}
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
            <label htmlFor="project-name">
              Nombre del proyecto *
            </label>

            <input
              id="project-name"
              name="nombre"
              type="text"
              maxLength={150}
              autoFocus
              required
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del proyecto"
            />
          </div>

          <div className="project-form-field">
            <label htmlFor="project-description">
              Descripción
            </label>

            <textarea
              id="project-description"
              name="descripcion"
              rows={4}
              maxLength={5000}
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del proyecto..."
            />
          </div>

          <div className="project-form-dates">
            <div className="project-form-field">
              <label htmlFor="project-start">
                Fecha de inicio
              </label>

              <input
                id="project-start"
                name="fecha_inicio"
                type="date"
                value={form.fecha_inicio}
                max={form.fecha_fin || undefined}
                onChange={handleChange}
              />
            </div>

            <div className="project-form-field">
              <label htmlFor="project-end">
                Fecha de finalización
              </label>

              <input
                id="project-end"
                name="fecha_fin"
                type="date"
                value={form.fecha_fin}
                min={form.fecha_inicio || undefined}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <p className="project-form-error" role="alert">
              {error}
            </p>
          )}

          <div className="project-modal-actions">
            <button
              className="btn secondary"
              type="button"
              disabled={saving}
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              className="btn"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear proyecto'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProjectFormModal;