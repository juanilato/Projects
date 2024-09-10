const helmet = require('helmet');
const express = require('express');
const { Pool } = require('pg'); // Import PostgreSQL library
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Default port if not set

const isProduction = process.env.NODE_ENV === 'production';

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: process.env.POSTGRES_PORT || 5432, // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false // Disable SSL certificate validation (adjust if needed)
    }
});

// Middleware para manejar errores de la base de datos
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Usar helmet para seguridad con configuración CSP personalizada
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"], // Permite recursos del mismo origen
                scriptSrc: isProduction 
                    ? ["'self'", "https://vercel.live/_next-live/feedback/feedback.js", "https://vercel.live/_next-live/*"] // Permite el script específico y todos los scripts en ese path en producción
                    : ["'self'", "https://vercel.live"], // Permite scripts desde Vercel en desarrollo
                styleSrc: ["'self'", "https://fonts.googleapis.com"], // Permite estilos del mismo origen y de Google Fonts
                imgSrc: ["'self'", "data:"], // Permite imágenes del mismo origen y datos
                connectSrc: isProduction 
                    ? ["'self'", "https://vercel.live"] // Permite conexiones a Vercel en producción
                    : ["'self'", "https://vercel.live"], // Permite conexiones a Vercel en desarrollo
                fontSrc: ["'self'", "https://fonts.gstatic.com"], // Permite fuentes del mismo origen y de Google Fonts
                objectSrc: ["'none'"], // No permite objetos
                frameSrc: ["'none'"], // No permite iframes
            }
        }
    })
);

// Ruta principal que muestra los productos
app.get('/', async (req, res) => {
    const query = 'SELECT * FROM products'; // Asegúrate de que la tabla se llama 'products'
    
    try {
        const { rows } = await pool.query(query);
        // Renderiza la vista y pasa los productos recuperados
        res.render('index', { products: rows });
    } catch (err) {
        console.error('Error fetching products:', err); // Registra el error para depuración
        res.status(500).send('Error retrieving products: ' + err.message); // Devuelve el mensaje de error al cliente
    }
});

// Ruta para la página "Sobre Nosotros"
app.get('/sobre_nos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'sobre_nos.html'));
});

// Ruta para redirigir a la página principal desde "Sobre Nosotros"
app.get('/volver_inicio', (req, res) => {
    res.redirect('/');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/`);
});
