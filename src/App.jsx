import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AuthProvider from './context/AuthProvider.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

const pages = [
  ['/dashboard', 'Dashboard', 'Resumen general de tus proyectos y tareas.'],
  ['/proyectos', 'Proyectos', 'Administra y consulta tus proyectos.'],
  ['/tareas', 'Mis tareas', 'Organiza y consulta tus actividades.'],
  ['/calendario', 'Calendario', 'Consulta las fechas de tus actividades.'],
  ['/equipo', 'Equipo', 'Consulta los miembros de tus proyectos.'],
  ['/mensajes', 'Mensajes', 'Comunicación de TaskFlow.'],
  ['/perfil', 'Mi perfil', 'Información de tu cuenta.'],
  ['/ajustes', 'Ajustes', 'Preferencias de la aplicación.'],
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
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