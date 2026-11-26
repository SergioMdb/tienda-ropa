import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Express corriendo correctamente' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  
  app.get('/', (req, res) => {
  res.send('API de Tienda de Ropa funcionando correctamente 🚀');
});
});