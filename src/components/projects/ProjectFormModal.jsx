import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { createProject } from '../../services/projectService.js';

const initialForm = {
  nombre: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
};

function ProjectFormModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && !saving) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
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

    setError('');

    const nombre = form.nombre.trim();

    if (!nombre) {
      setError('El nombre del proyecto es obligatorio.');
      return;
    }

    if (form.fecha_inicio && form.fecha_fin && form.fecha_fin < form.fecha_inicio) {
      setError('La fecha de finalización no puede ser anterior a la inicial.');
      return;
    }

    setSaving(true);

    try {
      await createProject({
        nombre,
        descripcion: form.descripcion.trim() || null,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
      });

      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible crear el proyecto. Intenta nuevamente.');
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
            <h2 id="project-modal-title">Nuevo proyecto</h2>
            <p className="sub">
              Completa la información para crear un proyecto.
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
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Rediseño de plataforma"
              autoFocus
              required
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
              placeholder="Describe el objetivo del proyecto..."
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
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              className="btn"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Crear proyecto'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProjectFormModal;