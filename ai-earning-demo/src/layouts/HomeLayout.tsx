import { Outlet } from 'react-router-dom';
import TabHeader from '../components/TabHeader';

function HomeLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TabHeader />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default HomeLayout;
