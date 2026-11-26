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