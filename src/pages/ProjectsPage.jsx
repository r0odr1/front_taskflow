import { useEffect, useState } from 'react';
import { FolderKanban, Search, RefreshCw } from 'lucide-react';

import ProjectCard from '../components/projects/ProjectCard.jsx';
import { getProjects } from '../services/projectService.js';

import '../styles/projects.css';

/**
 * Lista los proyectos accesibles al usuario autenticado.
 */
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        const data = await getProjects(controller.signal);

        if (!controller.signal.aborted) {
          setProjects(data);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err.response?.status === 401
            ? 'Tu sesión ha expirado. Inicia sesión nuevamente.'
            : 'No fue posible consultar los proyectos.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => controller.abort();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.nombre.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Proyectos</h1>
          <p className="sub">
            Consulta y organiza los proyectos de tu equipo.
          </p>
        </div>

        <div className="projects-counter">
          <FolderKanban size={18} />
          <span>{projects.length} proyectos</span>
        </div>
      </div>

      <div className="projects-toolbar">
        <label className="projects-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Buscar proyectos..."
            aria-label="Buscar proyectos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      {loading && (
        <section className="panel" role="status">
          Cargando proyectos...
        </section>
      )}

      {!loading && error && (
        <section className="panel" role="alert">
          <h2>Error al consultar proyectos</h2>
          <p className="sub">{error}</p>

          <button
            type="button"
            className="btn projects-retry"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </section>
      )}

      {!loading && !error && projects.length === 0 && (
        <section className="panel projects-empty">
          <FolderKanban size={44} strokeWidth={1.4} />

          <h2>No tienes proyectos registrados</h2>

          <p className="sub">
            Cuando se registren proyectos desde TaskFlow,
            aparecerán en este espacio.
          </p>
        </section>
      )}

      {!loading &&
        !error &&
        projects.length > 0 &&
        filteredProjects.length === 0 && (
          <section className="panel projects-empty">
            <Search size={36} />

            <h2>No encontramos resultados</h2>

            <p className="sub">
              Intenta buscar con otro nombre.
            </p>
          </section>
        )}

      {!loading && !error && filteredProjects.length > 0 && (
        <div className="projects">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default ProjectsPage;