import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Login } from './pages/login';
import { Registro } from './pages/registro';
import { Inicio } from './pages/inicio';
import { Perfil } from './pages/perfil';
import Productos from './pages/productos';
import { Navegación } from './components/Navegación';
import { PrivateRoute } from './components/PrivateRoute';
import { CartProvider } from './components/CartContext';

function AppContent(): React.JSX.Element {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const hideNavigationRoutes: string[] = ['/', '/login', '/registro'];
  const shouldHideByPath: boolean = hideNavigationRoutes.includes(location.pathname);
  const shouldShowNavigation: boolean = !shouldHideByPath && isAuthenticated;

  return (
    <div className="min-h-screen">
      {shouldShowNavigation && <Navegación />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Registro />} />
        <Route path='/inicio' element={
          <PrivateRoute>
            <Inicio />
          </PrivateRoute>
        } />
        <Route path='/productos' element={
          <PrivateRoute>
            <Productos />
          </PrivateRoute>
        } />
        <Route path='/perfil' element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;