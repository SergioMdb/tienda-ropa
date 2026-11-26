import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { cliente, items } = req.body; 
    // items: [{ variante_id: 1, cantidad: 2, precio_unitario: 15000 }]

    await connection.beginTransaction();

    // 1. Crear el registro de la reserva
    const [reservaResult] = await connection.query(
      'INSERT INTO reservas (nombre_cliente, email, telefono, total) VALUES (?, ?, ?, ?)',
      [cliente.nombre, cliente.email, cliente.telefono, cliente.total]
    );

    const reservaId = reservaResult.insertId;

    // 2. Descontar stock e insertar los detalles
    for (const item of items) {
      const [stockCheck] = await connection.query(
        'SELECT stock FROM variantes_producto WHERE id = ? FOR UPDATE',
        [item.variante_id]
      );

      if (stockCheck[0].stock < item.cantidad) {
        throw new Error(`Stock insuficiente para la variante ID: ${item.variante_id}`);
      }

      await connection.query(
        'UPDATE variantes_producto SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.variante_id]
      );

      await connection.query(
        'INSERT INTO detalles_reserva (reserva_id, variante_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [reservaId, item.variante_id, item.cantidad, item.precio_unitario]
      );
    }

    await connection.commit();
    res.json({ success: true, reservaId, message: 'Reserva procesada exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error procesando reserva:', error);
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
});

export default router;