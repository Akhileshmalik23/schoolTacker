import express from 'express';
import mysql from 'mysql2/promise'; // Use promise-based version
import bodyParser from 'body-parser';
import router from './routers/router.js'; // Ensure correct path and extension


const PORT = 3000;
const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('products api running new deploy');
});
app.get('/ping', (req, res) => {
    res.send('<=PONG=>');
});

// Initialize the database connection
const initDb = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3307,
            user: 'root',
            password: '1234',
            database: 'sys'
        });
        console.log('Connected to the database.');
        return connection;
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1); 
    }
};

const db = await initDb(); 

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
