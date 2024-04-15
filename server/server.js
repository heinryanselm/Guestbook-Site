import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = 'messages.db';

app.use(cors());
app.use(express.json());

let db;

async function connectDatabase() {
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

async function setupDatabase() {
    try {
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.post('/messages', async (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
    }
    try {
        const id = uuidv4();
        await db.run('INSERT INTO messages (id, name, message) VALUES (?, ?, ?)', [id, name, message]);
        console.log('New message created:', id);
        res.status(201).json({ id, name, message, likes: 0 });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await db.all('SELECT * FROM messages');
        res.json(messages);
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.delete('/messages/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('DELETE FROM messages WHERE id = ?', id);
        console.log('Message deleted:', id);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

app.post('/messages/:id/like', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('UPDATE messages SET likes = likes + 1 WHERE id = ?', id);
        console.log('Liked message:', id);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error liking message:', error);
        res.status(500).json({ error: 'Failed to like message' });
    }
});

async function startServer() {
    try {
        await connectDatabase();
        await setupDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();
