import { useState, useEffect } from 'react';
import { Button } from '../../../components/Button';
import AutocompleteInput from '../../../components/AutocompleteInput.jsx';
import api from '../../../utils/api';

/**
 * A small, reusable component for displaying an ingredient tag with a remove button.
 */
function IngredientTag({ ingredient, onRemove }) {
  return (
    <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full animate-fade-in">
      <span>{ingredient}</span>
      <button
        type="button"
        onClick={() => onRemove(ingredient)}
        className="text-slate-500 hover:text-red-600 transition-colors"
        title={`Eliminar ${ingredient}`}
      >
        <i className="fa-solid fa-trash-can"></i>
      </button>
    </div>
  );
}

/**
 * A component for managing the user's pantry of ingredients.
 */
export default function PantryManager({ initialPantry = [], onSave, isSaving }) {
  const [pantry, setPantry] = useState(initialPantry);
  const [inputValue, setInputValue] = useState('');
  const [allIngredients, setAllIngredients] = useState([]);


  // Sync state if the initial prop changes from the parent.
  useEffect(() => {
    setPantry(initialPantry);
  }, [initialPantry]);
  
  // Fetch all unique ingredients for autocomplete on mount.
  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const response = await api.get('/ingredients/unique');
        setAllIngredients(response.data);
      } catch (error) {
        console.error("Error fetching unique ingredients:", error);
      }
    };
    fetchAllIngredients();
  }, []);

  const suggestions = inputValue
    ? allIngredients
        .filter(ing => ing.toLowerCase().includes(inputValue.toLowerCase()))
        .filter(ing => !pantry.includes(ing)) // Don't suggest ingredients already in the pantry.
        .slice(0, 5) // Limit suggestions.
    : [];

  const handleAddIngredient = (ingredient) => {
    const trimmed = ingredient.trim();
    if (trimmed && !pantry.includes(trimmed)) {
      setPantry([...pantry, trimmed].sort());
    }
    setInputValue('');
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setPantry(pantry.filter(ing => ing !== ingredientToRemove));
  };

  const handleSave = () => {
    onSave(pantry);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-emerald-800">Mi Despensa</h3>
      
      {/* Input and Autocomplete */}
      <div className="flex gap-2">
        <AutocompleteInput
          value={inputValue}
          onChange={setInputValue}
          onSelect={handleAddIngredient}
          suggestions={suggestions}
          placeholder="Añadir un ingrediente..."
        />
        <Button onClick={() => handleAddIngredient(inputValue)} disabled={!inputValue}>
          Añadir
        </Button>
      </div>

      {/* Pantry List */}
      <div className="flex flex-wrap gap-2">
        {pantry.length > 0 ? (
          pantry.map(ingredient => (
            <IngredientTag key={ingredient} ingredient={ingredient} onRemove={handleRemoveIngredient} />
          ))
        ) : (
          <p className="text-sm text-slate-500 self-center mx-auto">Tu despensa está vacía. ¡Añade algunos ingredientes!</p>
        )}
      </div>

      {/* Save Button */}
      <div className="border-t pt-4 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Despensa'}
        </Button>
      </div>
    </div>
  );
}