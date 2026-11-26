import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'No fue posible iniciar sesión. Intenta nuevamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loginpage">
      <div className="login-orb login-orb-one" aria-hidden="true" />
      <div className="login-orb login-orb-two" aria-hidden="true" />
      <div className="login-orb login-orb-three" aria-hidden="true" />

      <div className="login-shell">
        <aside className="login-showcase" aria-label="TaskFlow">
          <div className="login-brand">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="brand-name">
              Task<span>Flow</span>
            </span>
          </div>

          <div className="showcase-copy">
            <p className="showcase-eyebrow">TU ESPACIO DE TRABAJO</p>
            <h2>Organiza el trabajo.<br />Impulsa los resultados.</h2>
            <p>Gestiona proyectos, tareas y avances de tu equipo desde un solo lugar.</p>
          </div>

          <div className="showcase-status">
            <span className="status-dot" aria-hidden="true" />
            <span>Todo sincronizado</span>
          </div>
        </aside>

        <main className="loginbox">
          <div className="login-mobile-brand">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="brand-name">
              Task<span>Flow</span>
            </span>
          </div>

          <div className="login-heading">
            <p className="login-kicker">BIENVENIDO</p>
            <h1>Inicia sesión</h1>
            <p>Accede al espacio de trabajo de tu equipo.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Correo electrónico</label>
            <div className="login-field">
              <Mail aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <label htmlFor="login-password">Contraseña</label>
            <div className="login-field">
              <LockKeyhole aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>

            {error && <p role="alert" className="login-error">{error}</p>}

            <button
              className="login-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="login-footer">TaskFlow · Gestión colaborativa</p>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;