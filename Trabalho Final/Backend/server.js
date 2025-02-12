const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./messages.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/add_message', (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });
    
    db.run(`INSERT INTO messages (content) VALUES (?)`, [content], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, content });
    });
});

app.delete('/delete_message/:id', (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Message ID is required' });

    db.run(`DELETE FROM messages WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Message not found' });
        res.json({ message: 'Message deleted successfully' });
    });
});

app.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let lastId = 0;
    const sendMessages = () => {
        db.all(`SELECT id, content FROM messages WHERE id > ?`, [lastId], (err, rows) => {
            if (err) return console.error(err.message);
            rows.forEach(row => {
                lastId = row.id;
                res.write(`data: ${JSON.stringify(row)}\n\n`);
            });
        });
    };

    const interval = setInterval(sendMessages, 2000);
    req.on('close', () => clearInterval(interval));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));