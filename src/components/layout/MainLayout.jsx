import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

function MainLayout() {
  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <Header />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;