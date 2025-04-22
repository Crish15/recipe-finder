import React, { useState, useRef } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import './recipes-carousel.css';
import SectionTitle from '../../components/SectionTitle';

export interface Ingredient {
  aisle: string;
  amount: number;
  id: number;
  image: string;
  meta: string[];
  name: string;
  original: string;
  originalName: string;
  unit: string;
  unitLong: string;
  unitShort: string;
  extendedName?: string;
}

export interface Recipe {
  id: number;
  image: string;
  imageType: string;
  likes: number;
  missedIngredientCount: number;
  missedIngredients: Ingredient[];
  title: string;
  unusedIngredients: Ingredient[];
  usedIngredientCount: number;
  usedIngredients: Ingredient[];
}

const Recipes: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
      const container = carouselRef.current;
      const card = container.querySelectorAll('.recipe-card')[index] as HTMLElement;
      if (card) {
        container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < recipes.length - 1) scrollToIndex(currentIndex + 1);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredient.trim()) return;
    setLoading(true);
    setError(null);
    setRecipes([]);
    try {
      const res = await fetch(`http://127.0.0.1:8080/recipes/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([ingredient.trim()]),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      setError('Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col gap-6">
      <SectionTitle>Find a Recipe by Ingredient</SectionTitle>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Type an ingredient (e.g. chicken)"
          value={ingredient}
          onChange={e => setIngredient(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="primary">Search Recipes</Button>
      </form>
      {loading && <div className="text-center text-neutral-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="relative">
        {/* Freccia sinistra */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-primary/20 text-primary border border-primary/30 rounded-full shadow p-2 transition disabled:opacity-30"
          style={{ display: recipes.length > 0 ? 'block' : 'none' }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Carosello */}
        <div
          ref={carouselRef}
          className="overflow-x-auto px-8 scrollbar-none"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-4 min-w-full pb-2">
            {recipes.map((recipe, idx) => (
              <div
                key={recipe.id}
                className={`recipe-card flex-shrink-0 w-full max-w-[480px] flex flex-col items-center bg-white/90 border border-primary/20 shadow-md rounded-2xl p-4 transition hover:shadow-xl hover:border-primary/40 ${idx === currentIndex ? '' : 'opacity-80'}`}
                style={{ minWidth: '100%', maxWidth: '100%' }}
              >
                <img src={recipe.image} alt={recipe.title} className="w-32 h-32 object-cover rounded-lg mb-2" />
                <div className="font-semibold text-center text-neutral-900 mb-2">{recipe.title}</div>
                {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {recipe.missedIngredients.map(ing => (
                      <div key={ing.id} className="flex flex-col items-center text-xs text-neutral-500">
                        <img src={ing.image} alt={ing.name} className="w-6 h-6 rounded-full border border-neutral-200 mb-1" />
                        <span>{ing.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Freccia destra */}
        <button
          type="button"
          aria-label="Scroll right"
          onClick={handleNext}
          disabled={currentIndex === recipes.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-primary/20 text-primary border border-primary/30 rounded-full shadow p-2 transition disabled:opacity-30"
          style={{ display: recipes.length > 0 ? 'block' : 'none' }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      {!loading && recipes.length === 0 && !error && (
        <div className="text-center text-neutral-400">No recipes found. Try searching for an ingredient!</div>
      )}
    </Card>
  );
};

export default Recipes;
