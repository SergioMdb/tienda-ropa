import React, { useEffect, useState } from 'react';
import api from './api/axios';
import ProductCard from './components/ProductCard';
import { Store, Loader2 } from 'lucide-react';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await api.get('/productos');
        setProductos(respuesta.data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudo conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar Superior */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Mi Tienda Local
            </h1>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-3 py-1 rounded-full">
            Retiro en Local
          </span>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Catálogo de Prendas</h2>
          <p className="text-sm text-gray-500">
            Consulta el stock disponible y reserva tu talle para retirar en la tienda.
          </p>
        </div>

        {/* Estado de Carga */}
        {cargando && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
            <p className="text-sm">Cargando productos...</p>
          </div>
        )}

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Grid de Productos */}
        {!cargando && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;