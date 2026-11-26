import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';

import AuthProvider from './context/AuthProvider.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';

const pages = [
  ['/tareas', 'Mis tareas', 'Organiza y consulta tus actividades.'],
  ['/calendario', 'Calendario', 'Consulta las fechas de tus actividades.'],
  ['/equipo', 'Equipo', 'Consulta los miembros de tus proyectos.'],
  ['/mensajes', 'Mensajes', 'Comunicación de TaskFlow.'],
  ['/perfil', 'Mi perfil', 'Información de tu cuenta.'],
  ['/ajustes', 'Ajustes', 'Preferencias de la aplicación.'],
];

const routeTitles = {
  '/login': 'Iniciar sesión',
  '/dashboard': 'Dashboard',
  '/proyectos': 'Proyectos',
  '/tareas': 'Mis tareas',
  '/calendario': 'Calendario',
  '/equipo': 'Equipo',
  '/mensajes': 'Mensajes',
  '/perfil': 'Mi perfil',
  '/ajustes': 'Ajustes',
};

function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = /^\/proyectos\/\d+$/.test(pathname)
      ? 'Detalle de proyecto'
      : routeTitles[pathname];
    document.title = pageTitle
      ? `TaskFlow | ${pageTitle}`
      : 'TaskFlow';
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DocumentTitle />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/proyectos" element={<ProjectsPage />} />
              <Route path="/proyectos/:id" element={<ProjectDetailPage />} />

              {pages.map(([path, title, description]) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <PlaceholderPage
                      title={title}
                      description={description}
                    />
                  }
                />
              ))}
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;