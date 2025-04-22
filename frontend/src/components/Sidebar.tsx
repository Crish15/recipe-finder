import { Link, useLocation } from 'react-router-dom';

const icons = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/recipes', icon: '🍳', label: 'Recipes' },
  { to: '/ingredients', icon: '🥚', label: 'Ingredients' },
  { to: '/saved-recipes', icon: '⭐', label: 'Saved' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <nav
      className="
        flex sm:flex-col items-center justify-between
        h-20 w-full sm:w-20 sm:h-full bg-white/95 rounded-3xl shadow-xl border border-neutral-200 z-20 py-6 px-2
      "
    >
      {/* Logo sempre visibile */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md">
          <img src="/vite.svg" alt="Logo" className="w-8 h-8" />
        </div>
      </div>
      {/* Pulsanti navigazione centrali (verticali su desktop) */}
      <div className="flex sm:flex-col items-center gap-4 flex-1 justify-center mt-6 mb-6">
        {icons.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`w-12 h-12 flex items-center justify-center rounded-full shadow border border-primary/40 bg-primary/10 text-2xl transition
              ${pathname === to ? 'ring-2 ring-primary bg-primary/80 text-white' : 'hover:bg-primary/20 hover:text-primary'}`}
            title={label}
          >
            <span>{icon}</span>
          </Link>
        ))}
      </div>
      {/* Avatar sempre visibile */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center shadow-md">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" className="w-10 h-10 rounded-full object-cover" />
        </div>
      </div>
    </nav>
  );
}
