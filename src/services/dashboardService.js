import { api } from './api.js';

/**
 * Obtiene los proyectos y tareas accesibles
 * para el usuario autenticado.
 */
export async function getDashboardData(signal) {
  const [projectsResponse, tasksResponse] = await Promise.all([
    api.get('/api/proyectos', { signal }),
    api.get('/api/tareas', { signal }),
  ]);

  return {
    projects: projectsResponse.data.data,
    tasks: tasksResponse.data.data,
  };
}