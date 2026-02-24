import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
};

async function initDatabase() {
    let connection;
    try {
        // Connect without database selected
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL server.");

        // Read schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema (includes CREATE DATABASE IF NOT EXISTS)
        console.log("Executing schema.sql...");
        await connection.query(schemaSql);

        console.log("Database initialized successfully.");
        console.log("Tables created and seeded.");

    } catch (err) {
        console.error("Database initialization failed:", err);
    } finally {
        if (connection) await connection.end();
    }
}

initDatabase();
