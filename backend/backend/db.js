import mysql from 'mysql2/promise';

// Create a connection pool
export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'planetx',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

// Add a to database
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

// Remove from database
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

// Update database
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

// Find user by email
export async function getUserByEmail(email) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows[0]; // vrátí jednoho uživatele
    } finally {
        connection.release();
    }
}

export async function getUserByVerificationToken(token) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE verification_token = ?",
            [token]
        );
        return rows[0];
    } finally {
        connection.release();
    }
}

export async function searchGames(query) {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
        "SELECT * FROM games WHERE LOWER(title) LIKE LOWER(?)",
        [`%${query}%`]
    );

    connection.release();
    return rows;
}

export async function getUserById(id) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
        return rows[0];
    } finally {
        connection.release();
    }
}

export async function migrateDb() {
    const connection = await pool.getConnection();
    try {
        console.log("Running database migrations...");

        // Ensure users table exists or create it
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                verification_token VARCHAR(255) NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                reset_token VARCHAR(255) NULL,
                reset_token_expires DATETIME NULL,
                profile_pic VARCHAR(255) NULL,
                bio TEXT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Ensure games table exists or create it
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NULL,
                developer VARCHAR(255) NULL,
                publisher VARCHAR(255) NULL,
                release_date DATETIME NULL,
                platform VARCHAR(255) NULL,
                price DECIMAL(10,2) DEFAULT 0.00,
                user_id INT NULL,
                file_path VARCHAR(255) NULL,
                image_path VARCHAR(255) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Ensure comments table exists or create it
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                page_id INT NOT NULL,
                user_id INT NULL,
                author VARCHAR(255) NOT NULL,
                text TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check user columns
        const [userCols] = await connection.execute("DESCRIBE users");
        const userColNames = userCols.map(c => c.Field);

        if (!userColNames.includes("reset_token")) {
            await connection.execute("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL");
        }
        if (!userColNames.includes("reset_token_expires")) {
            await connection.execute("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME NULL");
        }
        if (!userColNames.includes("verification_token")) {
            await connection.execute("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) NULL");
        }
        if (!userColNames.includes("is_verified")) {
            await connection.execute("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE");
        }
        if (!userColNames.includes("profile_pic")) {
            await connection.execute("ALTER TABLE users ADD COLUMN profile_pic VARCHAR(255) NULL");
        }
        if (!userColNames.includes("bio")) {
            await connection.execute("ALTER TABLE users ADD COLUMN bio TEXT NULL");
        }

        // Check games columns
        const [gameCols] = await connection.execute("DESCRIBE games");
        const gameColNames = gameCols.map(c => c.Field);

        if (!gameColNames.includes("user_id")) {
            await connection.execute("ALTER TABLE games ADD COLUMN user_id INT NULL");
        }
        if (!gameColNames.includes("file_path")) {
            await connection.execute("ALTER TABLE games ADD COLUMN file_path VARCHAR(255) NULL");
        }
        if (!gameColNames.includes("image_path")) {
            await connection.execute("ALTER TABLE games ADD COLUMN image_path VARCHAR(255) NULL");
        }
        if (!gameColNames.includes("genre_id")) {
            await connection.execute("ALTER TABLE games ADD COLUMN genre_id INT NULL");
        }

        // Migrate comments table foreign key to games(id) instead of pages(id)
        try {
            const [constraints] = await connection.execute(`
                SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = 'planetx' 
                  AND TABLE_NAME = 'comments' 
                  AND COLUMN_NAME = 'page_id'
            `);

            const constraint = constraints.find(r => r.REFERENCED_TABLE_NAME === 'pages');
            if (constraint) {
                console.log("Migrating comments constraint from pages to games...");
                await connection.execute(`ALTER TABLE comments DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`);
                await connection.execute("ALTER TABLE comments ADD CONSTRAINT fk_comments_games FOREIGN KEY (page_id) REFERENCES games(id) ON DELETE CASCADE");
                console.log("Comments constraint successfully migrated!");
            }
        } catch (err) {
            console.error("Comments foreign key migration failed:", err.message);
        }

        console.log("Database migrations completed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        connection.release();
    }
}



