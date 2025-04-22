import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar: React.FC = () => (
  <nav className="w-full bg-white border-b border-neutral-200 shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-10">
    <div className="text-xl font-bold tracking-tight text-neutral-900">🍏 Recipe Finder</div>
    <div className="flex gap-4">
      <Link className="text-neutral-700 hover:text-blue-600 font-medium transition" to="/">Home</Link>
      <Link className="text-neutral-700 hover:text-blue-600 font-medium transition" to="/recipes">Recipes</Link>
      <Link className="text-neutral-700 hover:text-blue-600 font-medium transition" to="/ingredients">Ingredients</Link>
      <Link className="text-neutral-700 hover:text-blue-600 font-medium transition" to="/saved-recipes">Saved</Link>
    </div>
  </nav>
);

export default NavigationBar;
