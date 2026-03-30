import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { theme } from '../config/theme';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  numeroTarjeta: string;
  telefono: string;
  direccion: string;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  numeroTarjeta?: string;
  telefono?: string;
  direccion?: string;
}

export function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    numeroTarjeta: '',
    telefono: '',
    direccion: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setApiError('');
    setLoading(true);
    try {
      const userData = {
        username: formData.username,
        email: formData.email || undefined,
        password: formData.password,
        numero_tarjeta: formData.numeroTarjeta.replace(/\s/g, ''), // Sin espacios
        telefono: formData.telefono.replace(/\s/g, ''),           // Sin espacios
        direccion: formData.direccion
      };
      const data = await registerUser(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/inicio');
    } catch (err: any) {
      if (typeof err === 'object' && err !== null) {
        setErrors(err);
      } else {
        setApiError(err.message || 'Error en el registro');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): Errors => {
    const errors: Errors = {};
    // Usuario
    if (formData.username.length < 3) {
      errors.username = 'El usuario debe tener al menos 3 caracteres';
    }
    // Email 
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    // Contraseña
    if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    // Tarjeta: 16 dígitos
    const cardClean = formData.numeroTarjeta.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardClean)) {
      errors.numeroTarjeta = 'El número de tarjeta debe tener 16 dígitos';
    }
    // Teléfono: solo dígitos y entre 7 y 15 dígitos
    const phoneClean = formData.telefono.replace(/\s/g, '');
    if (!/^\d+$/.test(phoneClean)) {
      errors.telefono = 'El teléfono debe contener solo dígitos';
    } else if (phoneClean.length < 7 || phoneClean.length > 15) {
      errors.telefono = 'El teléfono debe tener entre 7 y 15 dígitos';
    }
    // Dirección: requerida
    if (!formData.direccion.trim()) {
      errors.direccion = 'La dirección es obligatoria';
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'numeroTarjeta') {
      // Formatear con espacios cada 4 dígitos
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'telefono') {
      // Limitar solo dígitos y permitir hasta 15
      value = value.replace(/\D/g, '').slice(0, 15);
    }

    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name as keyof Errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
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
            {apiError && (
              <div className={`${theme.errorBg} border ${theme.errorBorder} ${theme.errorText} px-4 py-3 rounded mb-4`}>
                {apiError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Usuario */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="username">
                  Usuario *
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
                    className={`pl-10 w-full px-4 py-3 border ${errors.username ? 'border-red-300' : theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="Elige un nombre de usuario"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="email">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 border ${errors.email ? 'border-red-300' : theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="password">
                  Contraseña *
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
                    className={`pl-10 pr-12 w-full px-4 py-3 border ${errors.password ? 'border-red-300' : theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="Crea una contraseña segura"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-700">Mínimo 6 caracteres</p>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="confirmPassword">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-12 w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Número de Tarjeta */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="numeroTarjeta">
                  Número de Tarjeta *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v2H4v-2zm0 4h12v2H4v-2z" />
                    </svg>
                  </div>
                  <input
                    id="numeroTarjeta"
                    name="numeroTarjeta"
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.numeroTarjeta}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 border ${errors.numeroTarjeta ? 'border-red-300' : theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                {errors.numeroTarjeta && (
                  <p className="mt-1 text-sm text-red-600">{errors.numeroTarjeta}</p>
                )}
                <p className="mt-1 text-xs text-gray-700">Debe tener 16 dígitos</p>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="telefono">
                  Teléfono *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 border ${errors.telefono ? 'border-red-300' : theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="Ej: 123456789"
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                )}
                <p className="mt-1 text-xs text-gray-700">Entre 7 y 15 dígitos</p>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="direccion">
                  Dirección *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    required
                    value={formData.direccion}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 border ${errors.direccion ? 'border-red-300' : theme.inputBorder} rounded-lg ${theme.inputFocusRing} focus:border-transparent transition-all duration-300`}
                    placeholder="Calle, número, ciudad, etc."
                  />
                </div>
                {errors.direccion && (
                  <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${theme.buttonGradient} text-white font-medium py-3 px-4 rounded-lg ${theme.buttonHoverGradient} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50`}
              >
                {loading ? 'Cargando...' : 'Crear Cuenta'}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-900">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className={`font-medium ${theme.linkColor} ${theme.linkHoverColor}`}>
                    Inicia sesión aquí
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