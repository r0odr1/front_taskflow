export const initialTasksState = {
  tasks: [],
  projects: [],
  loading: true,
  error: '',
  search: '',
  selectedProject: 'all',
};

/**
 * Centraliza el estado de la pantalla de tareas.
 */
export function tasksReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        loading: true,
        error: '',
      };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: '',
        tasks: action.payload.tasks,
        projects: action.payload.projects,
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SET_SEARCH':
      return {
        ...state,
        search: action.payload,
      };

    case 'SET_PROJECT':
      return {
        ...state,
        selectedProject: action.payload,
      };

    default:
      return state;
  }
}