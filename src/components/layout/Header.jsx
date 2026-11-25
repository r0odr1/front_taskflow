import { Search, Bell, ChevronDown } from 'lucide-react';

function Header() {
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
          <span className="avatar">TF</span>

          <span className="profile-copy">
            <strong>TaskFlow</strong>
            <small>Sesión por configurar</small>
          </span>

          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

export default Header;