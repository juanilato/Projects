const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;


const path = require("path");


// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', 
    database: 'hair_accesories'
});



// Conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Configurar el motor de plantillas (opcional) para renderizar HTML
app.set('view engine', 'ejs'); // O cualquier motor de plantillas que prefieras

// Ruta principal que muestra los productos
app.get('/', (req, res) => {
    const query = 'SELECT * FROM products'; // Asume que tienes una tabla llamada 'products'
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Error retrieving products');
            return;
        }

        // Renderiza la vista y pasa los productos recuperados
        res.render('index', { products: results });
    });
});



// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));


// Ruta para la página "About"
app.get('/sobre_nos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'sobre_nos.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/`);
});





