import { useEffect, useRef } from 'react';
import {
  CalendarDays,
  LogOut,
  MessageSquare,
  Settings,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const secondaryLinks = [
  { path: '/calendario', label: 'Calendario', icon: CalendarDays },
  { path: '/equipo', label: 'Equipo', icon: Users },
  { path: '/mensajes', label: 'Mensajes', icon: MessageSquare },
  { path: '/perfil', label: 'Perfil', icon: UserRound },
  { path: '/ajustes', label: 'Ajustes', icon: Settings },
];

/**
 * Panel de opciones secundarias para dispositivos móviles.
 */
function MobileMenuSheet({ onClose, onLogout }) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll('a[href], button:not([disabled])'));

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  return (
    <div className="mobile-sheet-layer">
      <button
        type="button"
        className="mobile-sheet-backdrop"
        onClick={onClose}
        aria-label="Cerrar menú de opciones"
      />

      <section
        ref={dialogRef}
        className="mobile-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-sheet-title"
      >
        <div className="mobile-sheet-handle" aria-hidden="true" />

        <div className="mobile-sheet-header">
          <div>
            <h2 id="mobile-sheet-title">Más opciones</h2>
            <p>Explora otras secciones de TaskFlow.</p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="mobile-sheet-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="mobile-sheet-grid"
          aria-label="Opciones adicionales"
        >
          {secondaryLinks.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `mobile-sheet-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={23} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}

          <button
            type="button"
            className="mobile-sheet-link mobile-sheet-logout"
            onClick={onLogout}
          >
            <LogOut size={23} strokeWidth={1.8} />
            <span>Cerrar sesión</span>
          </button>
        </nav>
      </section>
    </div>
  );
}

export default MobileMenuSheet;