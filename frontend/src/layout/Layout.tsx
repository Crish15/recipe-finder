import React from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import PastaPattern from '../components/PastaPattern';

interface LayoutProps {
  children: React.ReactNode;
}

const userName = 'Alex'; // Placeholder, in futuro dinamico
const cuisineTypes = [
  { label: 'Mediterranean', value: 'mediterranean', emoji: '🌊' },
  { label: 'Asian', value: 'asian', emoji: '🍜' },
  { label: 'Fast Food', value: 'fastfood', emoji: '🍔' },
  { label: 'Vegetarian', value: 'vegetarian', emoji: '🥦' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="p-4 h-full w-full flex flex-col bg-gradient-to-br from-white via-blue-50 to-primary/10 relative overflow-hidden">
    <div className="flex flex-col-reverse sm:flex-row w-full h-full gap-8">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center px-2 py-8 sm:py-12 w-full">
        {/* Header utente e filtro cucina sopra il contenuto principale */}
        <header className="w-full flex flex-col sm:flex-row gap-4 mb-6 z-10 items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-lg text-neutral-700">👋 Hello, <span className="font-semibold text-neutral-900">{userName}</span></span>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
              What dish do you want to eat today?
            </h1>
            <span className="text-base text-neutral-500">Let me help you find the perfect recipe for your mood!</span>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {cuisineTypes.map((cuisine) => (
              <Button
                key={cuisine.value}
                type="button"
                variant="glass">
                <span className="text-xl">{cuisine.emoji}</span> {cuisine.label}
              </Button>
            ))}
          </div>
        </header>
        {children}
      </main>
    </div>
    <PastaPattern />
  </div>
);

export default Layout;
