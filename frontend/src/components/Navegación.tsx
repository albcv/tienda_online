import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logoutUser } from "../api/auth";
import { useCart } from "./CartContext";
import CartModal from "./CartModal"; 
import logo from '../img/logo.avif';
import carritoIcon from '../img/carrito.jpg';

export function Navegación() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={'/inicio'} className="flex items-center space-x-2 py-2 px-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-white font-bold text-xl">Tienda Online</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to={'/inicio'} className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium">
                Inicio
              </Link>
              <Link to={'/productos'} className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium">
                Productos
              </Link>
              <Link to={'/perfil'} className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium">
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Cerrar sesión
              </button>
              {/* Botón carrito - más grande y visible */}
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="relative bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200 ml-2"
                aria-label="Carrito de compras"
              >
                <img src={carritoIcon} alt="Carrito" className="w-7 h-7" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2">
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="relative bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all"
              >
                <img src={carritoIcon} alt="Carrito" className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-white/10 p-3 rounded-lg transition-colors"
                aria-label="Menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                ref={menuRef}
                className="absolute left-0 right-0 top-16 bg-gradient-to-b from-blue-800 to-indigo-900 shadow-lg py-4 px-4 z-50 md:hidden"
              >
                <div className="flex flex-col space-y-2">
                  <Link
                    to={'/inicio'}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                  >
                    Inicio
                  </Link>
                  <Link
                    to={'/productos'}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                  >
                    Productos
                  </Link>
                  <Link
                    to={'/perfil'}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium text-lg"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Modal del carrito */}
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </>
  );
}