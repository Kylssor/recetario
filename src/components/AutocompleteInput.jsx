import { useState } from 'react';
import { useTransition, animated } from '@react-spring/web';
import { Input } from './Form';

/**
 * A reusable, controlled autocomplete input component with a dropdown for suggestions.
 *
 * @param {object} props - The component props.
 * @param {string} props.value - The current value of the input.
 * @param {(newValue: string) => void} props.onChange - Callback for when the input value changes.
 * @param {(selectedValue: string) => void} props.onSelect - Callback for when a suggestion is selected.
 * @param {string[]} [props.suggestions=[]] - An array of suggestions to display in the dropdown.
 * @param {string} [props.placeholder=""] - The placeholder text for the input.
 */
export default function AutocompleteInput({ value, onChange, onSelect, suggestions = [], placeholder = "" }) {
  const [isFocused, setIsFocused] = useState(false);

  // Animation for the dropdown's appearance and disappearance.
  const dropdownTransition = useTransition(isFocused && suggestions.length > 0, {
    from: { opacity: 0, y: -6, scale: 0.98 },
    enter: { opacity: 1, y: 0, scale: 1 },
    leave: { opacity: 0, y: -6, scale: 0.98 },
    config: { tension: 250, friction: 20 },
  });

  const handleSelect = (selectedValue) => {
    onSelect(selectedValue);
    setIsFocused(false);
  };

  return (
    <div className="relative flex-1">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        // A short delay on blur allows the onMouseDown event on a suggestion to fire first.
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        autoComplete="off"
      />
      {dropdownTransition((style, show) =>
        show ? (
          <animated.ul
            style={style}
            className="absolute left-0 right-0 z-50 mt-1 rounded-xl border bg-white shadow-lg"
          >
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  // onMouseDown fires before onBlur, ensuring the selection is registered.
                  onMouseDown={() => handleSelect(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-emerald-50"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </animated.ul>
        ) : null
      )}
    </div>
  );
}