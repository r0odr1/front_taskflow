import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  CalendarDays,
  Users,
  MessageSquare,
  UserRound,
  Settings,
  LogOut,
} from 'lucide-react';

const menu = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/proyectos', label: 'Proyectos', icon: FolderKanban },
  { path: '/tareas', label: 'Mis tareas', icon: ListTodo },
  { path: '/calendario', label: 'Calendario', icon: CalendarDays },
  { path: '/equipo', label: 'Equipo', icon: Users },
  { path: '/mensajes', label: 'Mensajes', icon: MessageSquare },
];

const settings = [
  { path: '/perfil', label: 'Perfil', icon: UserRound },
  { path: '/ajustes', label: 'Ajustes', icon: Settings },
];

function MenuLink({ path, label, icon: Icon }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) => `nav ${isActive ? 'active' : ''}`}
    >
      <span className="ico">
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <span className="navlabel">{label}</span>
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="side">
      <NavLink to="/dashboard" className="brand">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
        </span>
        <span className="brand-name">
          Task<span>Flow</span>
        </span>
      </NavLink>

      <small>Principal</small>

      <nav aria-label="Menú principal">
        {menu.map((item) => (
          <MenuLink key={item.path} {...item} />
        ))}
      </nav>

      <small>Configuración</small>

      <nav aria-label="Configuración">
        {settings.map((item) => (
          <MenuLink key={item.path} {...item} />
        ))}
      </nav>

      <div className="bottom">
        <span className="nav logout-pending">
          <span className="ico"><LogOut size={20} /></span>
          <span className="navlabel">Cerrar sesión</span>
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;