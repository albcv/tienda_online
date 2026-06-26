import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.avif';

export function Inicio() {
  const navigate = useNavigate();

  const goToProductos = () => {
    navigate('/productos');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Bienvenido a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Tienda Online
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            La plataforma definitiva para tus compras favoritas. Encuentra productos de calidad con los mejores precios.
          </p>

          {/* 🔹 Botón para ir a Productos */}
          <div className="mt-8">
            <button
              onClick={goToProductos}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Ver Productos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}