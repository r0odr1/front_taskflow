import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

function Header() {

  const { user } = useAuth();

  const initials = user?.nombre
    ?.split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'TF';

  return (
    <header className="top">
      <div className="topsearch">
        <Search size={18} />
        <input
          type="search"
          placeholder="Buscar tareas, proyectos..."
          aria-label="Búsqueda global"
          title="La búsqueda estará disponible próximamente"
          disabled
        />
      </div>

      <div className="identity">
        <span
          className="topbell"
          aria-label="Notificaciones próximamente"
          title="Notificaciones próximamente"
        >
          <Bell size={20} />
        </span>

        <span className="top-divider" />

         <div className="profile-summary">
          <span className="avatar">{initials}</span>

          <span className="profile-copy">
            <strong>{user?.nombre || 'Usuario'}</strong>
            <small>{user?.rol || 'USER'}</small>
          </span>

          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

export default Header;