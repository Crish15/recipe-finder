import React from 'react';
import Recipes from '../Recipes/Recipes';

const HomePage: React.FC = () => {
  return (
      <div className="w-full grid grid-cols-2 xl:grid-cols-3 grid-rows-2 flex-wrap gap-8">
        <Recipes />
      </div>
  );
};

export default HomePage;