import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ producto }) {
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(
    producto?.variantes?.[0] || null
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagen del Producto */}
      <div className="h-64 bg-gray-100 flex items-center justify-center relative">
        {producto?.imagenes?.[0] ? (
          <img
            src={producto.imagenes[0].url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Sin imagen</span>
        )}
        {producto?.categoria && (
          <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {producto.categoria}
          </span>
        )}
      </div>

      {/* Detalle del Producto */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 text-lg mb-1">
          {producto?.nombre || 'Producto'}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-4">
          {producto?.descripcion || 'Sin descripción disponible.'}
        </p>

        {/* Selector de Talles / Variantes */}
        {producto?.variantes && producto.variantes.length > 0 && (
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Talles & Colores
            </label>
            <div className="flex flex-wrap gap-1.5">
              {producto.variantes.map((v) => {
                const esSeleccionado = varianteSeleccionada?.id === v.id;
                const sinStock = v.stock <= 0;

                return (
                  <button
                    key={v.id}
                    disabled={sinStock}
                    onClick={() => setVarianteSeleccionada(v)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                      esSeleccionado
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                        : sinStock
                        ? 'border-gray-200 bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {v.talle} - {v.color} ({v.stock})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Precio y Botón de Reserva */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
          <div>
            <span className="text-xs text-gray-400 block">Precio</span>
            <span className="text-xl font-bold text-gray-900">
              ${producto?.precio ? producto.precio.toLocaleString('es-AR') : '0'}
            </span>
          </div>

          <button
            disabled={!varianteSeleccionada || varianteSeleccionada.stock <= 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}