import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import MobileNavigation from './MobileNavigation.jsx';

function MainLayout() {
  const location = useLocation();

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <Header />

        <main className="content">
          <Outlet />
        </main>
      </div>

      <MobileNavigation key={location.pathname} />
    </div>
  );
}

export default MainLayout;