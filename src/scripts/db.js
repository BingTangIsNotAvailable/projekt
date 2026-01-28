import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Add a record
export async function addRecord(table, data) {
    const connection = await pool.getConnection();
    try {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        
        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const [result] = await connection.execute(query, values);
        return result;
    } finally {
        connection.release();
    }
}

// Remove a record
export async function removeRecord(table, id) {
    const connection = await pool.getConnection();
    try {
        const query = `DELETE FROM ${table} WHERE id = ?`;
        const [result] = await connection.execute(query, [id]);
        return result;
    } finally {
        connection.release();
    }
}

// Update a record
export async function updateRecord(table, id, data) {
    const connection = await pool.getConnection();
    try {
        const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        
        const query = `UPDATE ${table} SET ${updates} WHERE id = ?`;
        const [result] = await connection.execute(query, values);
        return result;
    } finally {
        connection.release();
    }
}

// Get all records
export async function getRecords(table) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`SELECT * FROM ${table}`);
        return rows;
    } finally {
        connection.release();
    }
}