const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

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

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
