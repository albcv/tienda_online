import React, { useState } from 'react';
import { useCart } from './CartContext';
import { crearCompra } from '../api/compras';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

 const handleCheckout = async () => {
  setLoading(true);
  try {
    await crearCompra({
      total: totalPrice,
      productos: cart.map(item => item.id), // Solo los IDs
    });
    alert('Compra realizada con éxito');
    clearCart();
    onClose();
  } catch (error) {
    console.error(error);
    alert('Error al procesar la compra');
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tu carrito</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay productos</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <img
                      src={item.ruta_imagen ? `http://localhost:8000${item.ruta_imagen}` : '/placeholder.png'}
                      alt={item.nombre}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.nombre}</h3>
                      <p className="text-sm text-gray-600">
                        {item.moneda.simbolo}{parseFloat(item.precio).toFixed(2)} c/u
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border rounded">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-4">Eliminar</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.moneda.simbolo}{(parseFloat(item.precio) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>{cart[0]?.moneda.simbolo}{totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Realizar compra'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;