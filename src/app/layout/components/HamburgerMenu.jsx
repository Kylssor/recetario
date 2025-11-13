import { useState } from 'react';
import useClickOutside from '../../../hooks/useClickOutside.js';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../modules/auth/stores/auth.js';
import HeaderButton from './HeaderButton.jsx';
import { Button } from '../../../components/Button.jsx';

/**
 * A self-contained hamburger menu component for the main application header.
 *
 * It manages its own open/closed state and provides navigation links and a logout button.
 */
export default function HamburgerMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const menuRef = useClickOutside(() => setIsMenuOpen(false));

  return (
    <div className="relative self-stretch" ref={menuRef}>
      <HeaderButton onClick={() => setIsMenuOpen((prev) => !prev)} className="h-full">
        <i className="fa-solid fa-bars"></i>
      </HeaderButton>

      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg z-20 p-2 flex flex-col gap-1 w-48">
          <Link
            to="/home"
            className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Perfil
          </Link>
          <Link
            to="/about"
            className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Acerca de
          </Link>
          <Link
            to="/faq"
            className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </Link>
          <hr className="my-1" />
          <Button
            variant="danger"
            className="justify-center"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </div>
  );
}
