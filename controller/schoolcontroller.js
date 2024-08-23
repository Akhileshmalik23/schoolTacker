import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '1234',
    database: 'sys'
};

const getConnection = async () => {
    return mysql.createConnection(dbConfig);
};

export const addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const connection = await getConnection();
        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        const [results] = await connection.execute(query, [name, address, latitude, longitude]);
        connection.end();
        res.status(201).json({ message: 'School added successfully.', schoolId: results.insertId });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ message: 'Error inserting data.' });
    }
};

// List School Controller
export const listSchool = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const userLat = parseFloat(latitude);
    const userLong = parseFloat(longitude);

    try {
        const connection = await getConnection()
        const query = 'SELECT * FROM schools'
        const [results] = await connection.execute(query)
        connection.end(); 

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRadians = degree => degree * (Math.PI / 180)
            const R = 6371; 
            const dLat = toRadians(lat2 - lat1)
            const dLon = toRadians(lon2 - lon1)
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // km
        };

        const sortedSchools = results.map(school => ({
            ...school,
            distance: calculateDistance(userLat, userLong, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Error fetching data.' });
    }
};
