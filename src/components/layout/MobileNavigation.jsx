import { useState } from 'react';
import {
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Grid2X2,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth.js';
import MobileMenuSheet from './MobileMenuSheet.jsx';

const primaryLinks = [
  { path: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { path: '/proyectos', label: 'Proyectos', icon: FolderKanban },
  { path: '/tareas', label: 'Tareas', icon: ListTodo },
];

const secondaryPaths = [
  '/calendario',
  '/equipo',
  '/mensajes',
  '/perfil',
  '/ajustes',
];

/**
 * Barra inferior exclusiva para navegación móvil.
 */
function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isSecondaryActive = secondaryPaths.includes(pathname);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <nav
        className="mobile-navigation"
        aria-label="Navegación móvil principal"
      >
        {primaryLinks.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={closeMenu}
            className={({ isActive }) =>
              `mobile-navigation-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={22} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className={`mobile-navigation-item ${
            isMenuOpen || isSecondaryActive ? 'active' : ''
          }`}
          onClick={() => setIsMenuOpen((previous) => !previous)}
          aria-expanded={isMenuOpen}
          aria-haspopup="dialog"
          aria-controls="taskflow-mobile-sheet"
        >
          <Grid2X2 size={22} strokeWidth={1.9} />
          <span>Más</span>
        </button>
      </nav>

      {isMenuOpen && (
        <div id="taskflow-mobile-sheet">
          <MobileMenuSheet
            onClose={closeMenu}
            onLogout={handleLogout}
          />
        </div>
      )}
    </>
  );
}

export default MobileNavigation;