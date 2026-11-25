import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import MainLayout from './components/layout/MainLayout.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <PlaceholderPage
                title="Dashboard"
                description="Resumen general de tus proyectos y tareas."
              />
            }
          />

          <Route
            path="/proyectos"
            element={
              <PlaceholderPage
                title="Proyectos"
                description="Administra y consulta tus proyectos."
              />
            }
          />

          <Route
            path="/tareas"
            element={
              <PlaceholderPage
                title="Mis tareas"
                description="Organiza tus actividades y realiza su seguimiento."
              />
            }
          />

          <Route
            path="/calendario"
            element={
              <PlaceholderPage
                title="Calendario"
                description="Consulta las fechas de tus actividades."
              />
            }
          />

          <Route
            path="/equipo"
            element={
              <PlaceholderPage
                title="Equipo"
                description="Consulta los miembros de tus proyectos."
              />
            }
          />

          <Route
            path="/mensajes"
            element={
              <PlaceholderPage
                title="Mensajes"
                description="Espacio de comunicación de TaskFlow."
              />
            }
          />

          <Route
            path="/perfil"
            element={
              <PlaceholderPage
                title="Mi perfil"
                description="Consulta la información de tu cuenta."
              />
            }
          />

          <Route
            path="/ajustes"
            element={
              <PlaceholderPage
                title="Ajustes"
                description="Preferencias de la aplicación."
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;