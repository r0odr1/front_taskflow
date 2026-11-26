import { api } from './api.js';

/**
 * Obtiene los proyectos accesibles del usuario.
 *
 * @param {AbortSignal} signal
 * @returns {Promise<object[]>}
 */
export async function getProjects(signal) {
  const response = await api.get('/api/proyectos', { signal });

  return response.data.data;
}

/**
 * Registra un nuevo proyecto para el usuario autenticado.
 *
 * @param {object} projectData
 * @returns {Promise<object>}
 */
export async function createProject(projectData) {
  const response = await api.post('/api/proyectos', projectData);

  return response.data.data;
}

/**
 * Consulta el detalle de un proyecto accesible
 * para el usuario autenticado.
 *
 * @param {number} projectId
 * @param {AbortSignal} signal
 * @returns {Promise<object>}
 */
export async function getProjectById(projectId, signal) {
  const response = await api.get(`/api/proyectos/${projectId}`, { signal });

  return response.data.data;
}