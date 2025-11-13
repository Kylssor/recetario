import { useEffect, useRef } from 'react';

/**
 * A custom hook that triggers a callback when a click is detected outside of a specified element.
 *
 * @param {Function} handler - The function to call when an outside click is detected.
 * @returns {React.RefObject} A ref that should be attached to the DOM element you want to monitor.
 */
export default function useClickOutside(handler) {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      // Check if the click is outside the referenced element
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', maybeHandler);
    document.addEventListener('touchstart', maybeHandler);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      document.removeEventListener('mousedown', maybeHandler);
      document.removeEventListener('touchstart', maybeHandler);
    };
  }, [handler]); // Re-subscribe if the handler function changes

  return domNode;
}