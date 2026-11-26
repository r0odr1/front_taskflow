import { CalendarDays, FolderKanban, UserRound } from 'lucide-react';

/**
 * Tarjeta informativa de un proyecto.
 */
function ProjectCard({ project }) {
  const formatDate = (value) => {
    if (!value) return 'Sin definir';

    const date = value.slice(0, 10);
    const [year, month, day] = date.split('-').map(Number);

    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));
  };

  return (
    <article className="project project-card">
      <div className="project-card-header">
        <span className="project-card-icon">
          <FolderKanban size={20} strokeWidth={1.8} />
        </span>

        <span className="tag">
          Proyecto
        </span>
      </div>

      <h2>{project.nombre}</h2>

      <p className="sub project-description">
        {project.descripcion || 'Sin descripción registrada.'}
      </p>

      <div className="project-card-details">
        <div>
          <UserRound size={16} />
          <span>
            {project.propietario || 'Sin propietario'}
          </span>
        </div>

        <div>
          <CalendarDays size={16} />
          <span>
            Inicio: {formatDate(project.fecha_inicio)}
          </span>
        </div>

        <div>
          <CalendarDays size={16} />
          <span>
            Fin: {formatDate(project.fecha_fin)}
          </span>
        </div>
      </div>

      <div className="project-card-footer">
        <span>
          Proyecto #{project.id}
        </span>
      </div>
    </article>
  );
}

export default ProjectCard;