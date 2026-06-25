import React, { useState, useEffect } from 'react';
import { getPerfil, cambiarPassword } from '../api/perfil';

interface PerfilUser {
  id?: number;
  username: string;
  email: string;
  date_joined?: string;
  examsCompleted?: number;
  averageScore?: number;
  [key: string]: any;
}

export function Perfil() {
  const [userData, setUserData] = useState<PerfilUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfil();
        setUserData(data as PerfilUser);
      } catch (err) {
        setError('Error al cargar perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.new.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    try {
      await cambiarPassword(passwordForm.current, passwordForm.new);
      setPasswordSuccess('Contraseña cambiada correctamente');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPasswordError(err.message);
      } else {
        setPasswordError('Error al cambiar contraseña');
      }
    }
  };

  if (loading) return <div className="text-center py-12 text-white">Cargando perfil...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!userData) return null;

  const iniciales = userData.username.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Perfil de Usuario</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 md:mb-0 md:mr-8">
                  <span className="text-blue-800 font-bold text-3xl">{iniciales}</span>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white">{userData.username}</h2>
                  <p className="text-blue-200 mt-2">{userData.email}</p>
                  <p className="text-blue-200 text-sm mt-1">Miembro desde: {userData.date_joined}</p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuración</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {passwordSuccess}
              </div>
            )}
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  name="current"
                  value={passwordForm.current}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="new"
                  value={passwordForm.new}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={passwordForm.confirm}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                    setPasswordForm({ current: '', new: '', confirm: '' });
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all"
                >
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}