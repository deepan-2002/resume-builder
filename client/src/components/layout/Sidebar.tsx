import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'Resume Editor', to: '/editor/1' },
  { label: 'Templates', to: '/templates' },
];

const Sidebar = () => {
  return (
    <aside className="w-56 border-r border-slate-200 bg-slate-50 px-4 py-6">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-600 hover:bg-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

