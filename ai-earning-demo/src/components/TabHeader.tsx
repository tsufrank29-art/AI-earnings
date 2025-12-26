import { NavLink } from 'react-router-dom';

function TabHeader() {
  const baseClasses = 'px-4 py-2 text-sm font-medium rounded-full';
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-lg font-semibold text-indigo-700">AI 讀法說</div>
        <nav className="flex gap-2">
          <NavLink
            to="/list"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`
            }
          >
            法說會列表
          </NavLink>
          <NavLink
            to="/follow"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`
            }
          >
            我關注的法說
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default TabHeader;
