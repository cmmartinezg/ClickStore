const express = require('express');
const path = require('path');
const cors = require('cors'); // Importamos el paquete CORS
const app = express();
const port = 4000;

// Configuración de CORS para permitir solicitudes desde el backend (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000', // Asegúrate de que esta URL coincida con tu backend
  methods: ['GET', 'POST'], // Permitir solo los métodos que usas
  allowedHeaders: ['Content-Type'] // Permitir los encabezados necesarios
}));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para el restablecimiento de contraseña
app.get('/reset-password', (req, res) => {
  const token = req.query.token; // Obtenemos el token de la URL
  console.log('Token recibido:', token);

  // Puedes manejar el token aquí, por ejemplo, para validar o mostrar un formulario
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html')); // O la página específica para restablecer la contraseña
});

// Ruta para hacer la solicitud POST de restablecimiento de contraseña
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token y nueva contraseña son requeridos.' });
  }

  try {
    const response = await fetch('http://localhost:3000/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      res.json({ message: 'Contraseña restablecida con éxito' });
    } else {
      res.status(400).json({ message: data.message || 'Error al restablecer la contraseña' });
    }
  } catch (error) {
    console.error('Error en la solicitud de restablecimiento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
