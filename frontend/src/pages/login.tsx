import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { theme } from '../config/theme';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ username: string; password: string }>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(formData.username, formData.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/inicio');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header con título configurable */}
          <div className={`bg-gradient-to-r ${theme.headerGradient} p-8 text-center`}>
            <h1 className="text-3xl font-bold text-white">{theme.appTitle}</h1>
          </div>

          {/* Formulario con fondo configurable */}
          <div className={`p-8 ${theme.formBackground}`}>
            {error && (
              <div className={`${theme.errorBg} border ${theme.errorBorder} ${theme.errorText} px-4 py-3 rounded mb-4`}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="username">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 border ${theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="Ingresa tu usuario"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-12 w-full px-4 py-3 border ${theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="Ingresa tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {/* íconos igual que antes */}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${theme.buttonGradient} text-white font-medium py-3 px-4 rounded-lg ${theme.buttonHoverGradient} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50`}
              >
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-900">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/registro" className={`font-medium ${theme.linkColor} ${theme.linkHoverColor}`}>
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}