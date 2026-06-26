import { useState, useEffect } from 'react';
import { getProductos } from '../api/productos';
import type { Producto } from '../api/productos';
import { useCart } from '../components/CartContext';
import { API_URL } from '../api/config';

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [expandedDesc, setExpandedDesc] = useState<number | null>(null);
  const { addToCart } = useCart();

  const fetchProductos = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const newOffset = reset ? 0 : offset;
      const data = await getProductos(
        selectedCategoria ?? undefined,
        searchTerm || undefined,
        newOffset,
        100
      );
      if (reset) {
        setProductos(data.results);
        setOffset(100);
        // Extraer categorías únicas con id y nombre
        const catsMap = new Map<number, string>();
        data.results.forEach(p => {
          if (!catsMap.has(p.categoria.id)) {
            catsMap.set(p.categoria.id, p.categoria.nombre);
          }
        });
        const catsArray = Array.from(catsMap, ([id, nombre]) => ({ id, nombre }));
        setCategorias(catsArray);
      } else {
        setProductos(prev => [...prev, ...data.results]);
        setOffset(newOffset + data.results.length);
      }
      setHasMore(newOffset + data.results.length < data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Resetear cuando cambia filtro o búsqueda
  useEffect(() => {
    setOffset(0);
    setProductos([]);
    setHasMore(true);
    fetchProductos(true);
  }, [selectedCategoria, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const clearFilters = () => {
    setSelectedCategoria(null);
    setSearchTerm('');
    setSearchInput('');
  };

  const loadMore = () => {
    if (hasMore && !loading) fetchProductos(false);
  };

  const toggleDescripcion = (id: number) => {
    setExpandedDesc(expandedDesc === id ? null : id);
  };

  const hasActiveFilters = selectedCategoria !== null || searchTerm !== '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-300 mb-6">Productos</h1>

      {/* Filtros */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
          <select
            value={selectedCategoria ?? ''}
            onChange={(e) => setSelectedCategoria(e.target.value ? Number(e.target.value) : null)}
            className="block w-full md:w-64 px-3 py-2 bg-white border rounded-md"
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Buscar por nombre</label>
          <div className="flex">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 border rounded-l-md"
              placeholder="Ej. laptop"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
            >
              🔍
            </button>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            ✖ Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map(producto => (
          <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              {producto.ruta_imagen ? (
                <img src={`${API_URL}${producto.ruta_imagen}`} alt={producto.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">Sin imagen</div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{producto.nombre}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {expandedDesc === producto.id
                  ? producto.descripcion
                  : `${producto.descripcion.substring(0, 100)}${producto.descripcion.length > 100 ? '...' : ''}`}
                {producto.descripcion.length > 100 && (
                  <button onClick={() => toggleDescripcion(producto.id)} className="text-blue-500 ml-1">
                    {expandedDesc === producto.id ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-blue-600">
                  {producto.moneda.simbolo}{parseFloat(producto.precio).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {producto.categoria.nombre}
                </span>
              </div>
              <button
                onClick={() => addToCart(producto)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="text-center py-4 text-white">Cargando...</div>}
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <button onClick={loadMore} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md">
            Cargar más productos
          </button>
        </div>
      )}
      {!hasMore && productos.length > 0 && (
        <div className="text-center text-gray-400 mt-8">No hay más productos</div>
      )}
    </div>
  );
};

export default Productos;