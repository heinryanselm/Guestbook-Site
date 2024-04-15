// Create a new message
async function createMessage(name, message) {
    const id = uuidv4();
    try {
        await db.run('INSERT INTO messages (id, name, message) VALUES (?, ?, ?)', [id, name, message]);
        console.log('New message created:', id);
        return id;
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
}

// Get all messages
async function getMessages() {
    try {
        const messages = await db.all('SELECT * FROM messages');
        return messages;
    } catch (error) {
        console.error('Error getting messages:', error);
        throw error;
    }
}

// Delete a message by ID
async function deleteMessage(id) {
    try {
        await db.run('DELETE FROM messages WHERE id = ?', id);
        console.log('Message deleted:', id);
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
}

// Like a message by ID
async function likeMessage(id) {
    try {
        await db.run('UPDATE messages SET likes = likes + 1 WHERE id = ?', id);
        console.log('Liked message:', id);
    } catch (error) {
        console.error('Error liking message:', error);
        throw error;
    }
}
