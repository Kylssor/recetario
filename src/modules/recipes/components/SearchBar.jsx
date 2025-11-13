import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AutocompleteInput from '../../../components/AutocompleteInput.jsx'
import { Button } from '../../../components/Button'

const MOCK_INGREDIENTS = [
  'pollo',
  'atún',
  'zanahoria',
  'avena',
  'huevo',
  'espinaca',
  'lentejas',
  'quinoa',
  'tomate',
  'banana',
  'pepino',
]

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const suggestions = MOCK_INGREDIENTS.filter(
    (item) => query && item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const handleSearch = (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
    setQuery(''); // Clear input after search
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1">
      <AutocompleteInput
        value={query}
        onChange={setQuery}
        onSelect={handleSearch}
        suggestions={suggestions}
        placeholder="Busca por ingrediente..."
      />
      <Button type="submit" className="self-stretch">Buscar</Button>
    </form>
  );
}