import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET: Obtener todos los productos y agrupar sus variantes
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.destacado,
        c.nombre AS categoria,
        v.id AS variante_id,
        v.talle,
        v.color,
        v.stock,
        v.sku
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN variantes_producto v ON v.producto_id = p.id
      ORDER BY p.creado_en DESC;
    `;

    const [rows] = await pool.query(query);

    // Agrupamos los resultados por producto usando JavaScript
    const productosMap = new Map();

    rows.forEach(row => {
      if (!productosMap.has(row.id)) {
        productosMap.set(row.id, {
          id: row.id,
          nombre: row.nombre,
          descripcion: row.descripcion,
          precio: parseFloat(row.precio),
          destacado: row.destacado,
          categoria: row.categoria,
          variantes: [],
          imagenes: []
        });
      }

      // Si el producto tiene una variante asociada, la agregamos
      if (row.variante_id) {
        productosMap.get(row.id).variantes.push({
          id: row.variante_id,
          talle: row.talle,
          color: row.color,
          stock: row.stock,
          sku: row.sku
        });
      }
    });

    const productos = Array.from(productosMap.values());
    res.json(productos);

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al consultar el catálogo de productos' });
  }
});

export default router;