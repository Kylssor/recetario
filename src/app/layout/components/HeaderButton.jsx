import { Button } from "../../../components/Button";

/**
 * A specialized button for the application header.
 *
 * This component wraps the base Button and applies consistent styling
 * (variant, size, flex properties) for all buttons in the main layout header,
 * ensuring they have a uniform look and feel.
 *
 * @param {object} props - The component props, which are passed down to the base Button.
 * @param {React.ReactNode} props.children - The content of the button.
 */
export default function HeaderButton({ children, className = '', ...props }) {
  const combinedClassName = `flex items-center gap-2 ${className}`;

  return (
    <Button variant="secondary" className={combinedClassName} {...props}>
      {children}
    </Button>
  );
}