import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { AuthContext } from './AuthContext.js';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const token = sessionStorage.getItem('taskflow_token');

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/auth/me');

        if (active) setUser(response.data.data);
      } catch (error) {
        if (error.response?.status === 401) {
          sessionStorage.removeItem('taskflow_token');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });

    const { token, user: authenticatedUser } = response.data.data;

    sessionStorage.setItem('taskflow_token', token);
    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const logout = () => {
    sessionStorage.removeItem('taskflow_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;