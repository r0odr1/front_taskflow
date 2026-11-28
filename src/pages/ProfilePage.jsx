import { useEffect, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth.js';
import { api } from '../services/api.js';

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await api.get('/api/auth/me');

        if (active) {
          setProfile(response.data.data);
          setError('');
        }
      } catch {
        if (active) {
          setError('No se pudo actualizar la información del perfil.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const name = profile?.nombre || 'Usuario';
  const email = profile?.email || 'No disponible';

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  const role = profile?.rol === 'ADMIN'
    ? 'Administrador'
    : 'Usuario';

  const fields = [
    {
      label: 'Nombre completo',
      value: name,
      icon: UserRound,
    },
    {
      label: 'Correo electrónico',
      value: email,
      icon: Mail,
    },
    {
      label: 'Rol de usuario',
      value: role,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="profile-page">
      <div className="pagehead">
        <div>
          <h1>Mi perfil</h1>
          <p className="sub">
            Consulta la información de tu cuenta de TaskFlow.
          </p>
        </div>
      </div>

      {error && (
        <p className="profile-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="profile-loading" role="status">
          Cargando información del perfil...
        </p>
      ) : (
        <>
          <section className="profile-hero">
            <div className="profile-avatar" aria-hidden="true">
              {initials}
            </div>

            <div className="profile-hero-info">
              <h2>{name}</h2>
              <p>{email}</p>
              <span className="profile-role">{role}</span>
            </div>
          </section>

          <div className="profile-grid">
            <section className="profile-section">
              <div className="profile-section-heading">
                <UserRound size={21} />
                <h2>Información personal</h2>
              </div>

              <div className="profile-fields">
                {fields.map(({ label, value, icon: Icon }) => (
                  <div className="profile-field" key={label}>
                    <span className="profile-field-icon">
                      <Icon size={19} />
                    </span>

                    <div>
                      <span className="profile-field-label">
                        {label}
                      </span>
                      <strong>{value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="profile-side">
              <section className="profile-section">
                <div className="profile-section-heading">
                  <ShieldCheck size={21} />
                  <h2>Seguridad</h2>
                </div>

                <p className="profile-description">
                  Tu cuenta utiliza autenticación mediante JWT.
                  Nunca compartas tus credenciales.
                </p>

                <div className="profile-security-status">
                  <CheckCircle2 size={18} />
                  Sesión autenticada
                </div>
              </section>

              <section className="profile-section">
                <div className="profile-section-heading">
                  <CalendarDays size={21} />
                  <h2>Tu cuenta</h2>
                </div>

                <p className="profile-description">
                  Aquí podrás administrar tus datos personales,
                  cambiar tu contraseña y configurar tus
                  preferencias.
                </p>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfilePage;