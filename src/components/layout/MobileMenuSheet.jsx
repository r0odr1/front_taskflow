import { useEffect, useRef, useState } from 'react';
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

const CLOSE_THRESHOLD = 90;

/**
 * Panel inferior con animaciones y gesto de arrastre.
 */
function MobileMenuSheet({
  closing,
  onRequestClose,
  onLogout,
}) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const gestureRef = useRef(null);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Inicia la transición después de que el panel se monta.
  useEffect(() => {
    let secondFrame;

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);

      if (secondFrame !== undefined) {
        cancelAnimationFrame(secondFrame);
      }
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onRequestClose();
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
  }, [onRequestClose]);

  /**
   * Comienza el gesto al tocar la manija superior.
   */
  const handlePointerDown = (event) => {
    if (closing || !event.isPrimary) return;

    gestureRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
    };

    setIsDragging(true);
    setDragY(0);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  /**
   * Sigue el dedo, permitiendo únicamente arrastrar hacia abajo.
   */
  const handlePointerMove = (event) => {
    const gesture = gestureRef.current;

    if (!gesture || gesture.pointerId !== event.pointerId) {
      return;
    }

    const distance = event.clientY - gesture.startY;

    setDragY(Math.max(0, Math.min(distance, 500)));
  };

  /**
   * Si el desplazamiento es suficiente, cierra el panel.
   * De lo contrario, regresa suavemente a su posición.
   */
  const handlePointerUp = (event) => {
    const gesture = gestureRef.current;

    if (!gesture || gesture.pointerId !== event.pointerId) {
      return;
    }

    const distance = Math.max(0, event.clientY - gesture.startY);

    gestureRef.current = null;
    setIsDragging(false);

    if (distance >= CLOSE_THRESHOLD) {
      setDragY(Math.min(distance, 500));
      onRequestClose();
    } else {
      setDragY(0);
    }
  };

  const handlePointerCancel = () => {
    gestureRef.current = null;
    setIsDragging(false);
    setDragY(0);
  };

  return (
    <div className="mobile-sheet-layer">
      <button
        type="button"
        className={`mobile-sheet-backdrop ${
          isVisible ? 'is-visible' : ''
        } ${closing ? 'is-closing' : ''}`}
        onClick={onRequestClose}
        aria-label="Cerrar menú de opciones"
      />

      <section
        ref={dialogRef}
        className={`mobile-sheet ${
          isVisible ? 'is-visible' : ''
        } ${closing ? 'is-closing' : ''} ${
          isDragging ? 'is-dragging' : ''
        }`}
        style={{
          '--sheet-offset': `${dragY}px`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-sheet-title"
      >
        <div
          className="mobile-sheet-drag-area"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          aria-hidden="true"
        >
          <div className="mobile-sheet-handle" />
        </div>

        <div className="mobile-sheet-header">
          <div>
            <h2 id="mobile-sheet-title">
              Más opciones
            </h2>

            <p>
              Explora otras secciones de TaskFlow.
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="mobile-sheet-close"
            onClick={onRequestClose}
            aria-label="Cerrar menú"
            disabled={closing}
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
              className={({ isActive }) =>
                `mobile-sheet-link ${
                  isActive ? 'active' : ''
                }`
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