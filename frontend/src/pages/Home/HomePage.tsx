import React from 'react'
import Recipes from '../Recipes/Recipes'

const HomePage: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-8 overflow-auto">
      <Recipes />
    </div>
  )
}

export default HomePage
