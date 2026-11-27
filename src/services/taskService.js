import { api } from './api.js';

/**
 * Obtiene las tareas asociadas a un proyecto.
 *
 * @param {number} projectId
 * @param {AbortSignal} signal
 * @returns {Promise<object[]>}
 */
export async function getTasksByProject(projectId, signal) {
  const response = await api.get('/api/tareas', {
    params: {
      proyecto_id: projectId,
    },
    signal,
  });

  return response.data.data;
}


/**
 * Obtiene las tareas accesibles al usuario autenticado.
 *
 * @param {AbortSignal} signal
 * @returns {Promise<object[]>}
 */
export async function getTasks(signal) {
  const response = await api.get('/api/tareas', { signal });

  return response.data.data;
}

/**
 * Crea una tarea dentro de un proyecto propio.
 *
 * @param {object} taskData
 * @returns {Promise<object>}
 */
export async function createTask(taskData) {
  const response = await api.post('/api/tareas', taskData);

  return response.data.data;
}