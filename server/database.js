// database.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_FILE = 'messages.db';

let db;

export async function connectDatabase() {
    try {
        db = await open({
            filename: DB_FILE,
            driver: sqlite3.Database
        });
        console.log('Connected to SQLite database:', DB_FILE);
    } catch (error) {
        console.error('Error connecting to SQLite database:', error);
        throw error;
    }
}

export async function setupDatabase() {
    try {
        await connectDatabase();
        await db.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                name TEXT,
                message TEXT,
                likes INTEGER DEFAULT 0
            )
        `);
        console.log('Messages table created');
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    }
}

export async function seedDatabase() {
    try {
        await db.run('INSERT INTO messages (id, name, message) VALUES (?, ?, ?)', ['1', 'John Doe', 'Welcome to our guestbook!']);
        await db.run('INSERT INTO messages (id, name, message) VALUES (?, ?, ?)', ['2', 'Jane Smith', 'Excited to be here!']);
        console.log('Database seeded with initial data');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

(async () => {
    try {
        await setupDatabase();
        await seedDatabase();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
})();
