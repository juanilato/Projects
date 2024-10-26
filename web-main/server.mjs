import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa fileURLToPath
import pkg from 'pg';
import helmet from 'helmet';

// Obtener el __dirname equivalente en ES6
const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === 'production';

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: process.env.POSTGRES_PORT || 5432,
    ssl: {
        rejectUnauthorized: false
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

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: isProduction 
                    ? ["'self'", "https://vercel.live/_next-live/feedback/feedback.js", "https://vercel.live/_next-live/*", "https://vercel.live/_next-live/feedback/instrument.75fcae37624ec0f476e1.js"]
                    : ["'self'", "https://vercel.live"],
            
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'", 
                    "https://fonts.googleapis.com",
                    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                ],
                imgSrc: ["'self'", "data:"],
                connectSrc: isProduction 
                    ? ["'self'", "https://vercel.live"]
                    : ["'self'", "https://vercel.live"],
                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com",
                    "https://cdnjs.cloudflare.com"  
                ],
                objectSrc: ["'none'"],
                frameSrc: ["'self'", "https://vercel.live"],
            }
        }
    })
);
    
// Ruta principal que muestra los productos
app.get('/', async (req, res) => {
    const query = 'SELECT * FROM products ORDER BY orden ASC'; 
    
    try {
        const { rows } = await pool.query(query);
        // Renderiza la vista y pasa los productos recuperados
        res.render('index', { products: rows });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error retrieving products: ' + err.message);
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/`);
});
