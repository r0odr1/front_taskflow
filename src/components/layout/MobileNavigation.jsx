import { useEffect, useState } from 'react';
import {
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  ListTodo,
} from 'lucide-react';
import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth.js';
import MobileMenuSheet from './MobileMenuSheet.jsx';

const CLOSE_DURATION = 380;
const SCROLL_THRESHOLD = 14;
const TOP_SCROLL_THRESHOLD = 16;

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

function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isSecondaryActive = secondaryPaths.includes(pathname);

  const openMenu = () => {
    if (isMenuOpen) return;

    setIsNavigationVisible(true);
    setIsClosing(false);
    setIsMenuOpen(true);
  };

  const requestClose = () => {
    if (!isClosing) {
      setIsClosing(true);
    }
  };

  // Garantiza el cierre aunque animationend no se dispare.
  useEffect(() => {
    if (!isClosing) return undefined;

    const timeout = window.setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, CLOSE_DURATION);

    return () => window.clearTimeout(timeout);
  }, [isClosing]);

  useEffect(() => {
    const mobileViewport = window.matchMedia('(max-width: 640px)');
    let lastScrollY = window.scrollY;
    let accumulatedDistance = 0;
    let lastDirection = 0;

    const resetScrollTracking = () => {
      lastScrollY = window.scrollY;
      accumulatedDistance = 0;
      lastDirection = 0;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const distance = currentScrollY - lastScrollY;

      lastScrollY = currentScrollY;

      if (!mobileViewport.matches || isMenuOpen || currentScrollY <= TOP_SCROLL_THRESHOLD) {
        setIsNavigationVisible(true);
        resetScrollTracking();
        return;
      }

      if (distance === 0) return;

      const direction = Math.sign(distance);

      if (direction !== lastDirection) {
        accumulatedDistance = 0;
        lastDirection = direction;
      }

      accumulatedDistance += Math.abs(distance);

      if (accumulatedDistance >= SCROLL_THRESHOLD) {
        setIsNavigationVisible(direction < 0);
        accumulatedDistance = 0;
      }
    };

    const handleResize = () => {
      resetScrollTracking();
      setIsNavigationVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <nav
        className={`mobile-navigation ${
          isNavigationVisible || isMenuOpen ? '' : 'is-hidden'
        }`}
        aria-label="Navegación móvil principal"
      >
        {primaryLinks.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `mobile-navigation-item ${
                isActive ? 'active' : ''
              }`
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
          onClick={isMenuOpen ? requestClose : openMenu}
          aria-expanded={isMenuOpen && !isClosing}
          aria-haspopup="dialog"
        >
          <Grid2X2 size={22} strokeWidth={1.9} />
          <span>Más</span>
        </button>
      </nav>

      {isMenuOpen && (
        <MobileMenuSheet
          closing={isClosing}
          onRequestClose={requestClose}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default MobileNavigation;