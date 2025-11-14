import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

