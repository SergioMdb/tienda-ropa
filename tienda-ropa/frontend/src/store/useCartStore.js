import { create } from 'zustand';

export const useCartStore = create((set) => ({
  carrito: [],
  agregarAlCarrito: (producto, variante) =>
    set((state) => {
      const existeIndex = state.carrito.findIndex(
        (item) => item.variante.id === variante.id
      );

      if (existeIndex >= 0) {
        const nuevoCarrito = [...state.carrito];
        nuevoCarrito[existeIndex].cantidad += 1;
        return { carrito: nuevoCarrito };
      }

      return {
        carrito: [...state.carrito, { producto, variante, cantidad: 1 }]
      };
    }),
  vaciarCarrito: () => set({ carrito: [] })
}));