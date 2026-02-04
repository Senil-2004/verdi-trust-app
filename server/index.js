import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

// Database Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'verdi_trust_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Connection
pool.getConnection()
    .then(async conn => {
        console.log("Connected to MySQL Database!");
        try {
            await conn.query("ALTER TABLE listings ADD COLUMN IF NOT EXISTS certificate_file VARCHAR(255);");
            await conn.query("ALTER TABLE listings ADD COLUMN IF NOT EXISTS cover_image VARCHAR(255);");
            await conn.query("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255);");
            await conn.query(`
                CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    message TEXT,
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            const [count] = await conn.query('SELECT COUNT(*) as count FROM notifications');
            if (count[0].count === 0) {
                await conn.query(`
                     INSERT INTO notifications (title, message, created_at) VALUES 
                     ('New asset verification pending', 'A new listing requires your attention.', NOW() - INTERVAL 2 HOUR),
                     ('Carbon credit settlement cleared', 'Transaction #1234 has been processed successfully.', NOW() - INTERVAL 5 HOUR),
                     ('Market analysis report available', 'The monthly market report for January is now available.', NOW() - INTERVAL 1 DAY),
                     ('Welcome to VerdiTrust', 'Thank you for joining our platform.', NOW() - INTERVAL 2 DAY)
                 `);
                console.log("Initial notifications seeded.");
            }

            console.log("Database schema updated: columns verified.");
        } catch (schemaErr) {
            console.error("Schema update notice:", schemaErr.message);
        }
        conn.release();
    })
    .catch(err => {
        console.error("Error connecting to database:", err.message);
        console.log("Ensure XAMPP MySQL is running and you have imported 'schema.sql'");
    });

app.get('/', (req, res) => {
    res.send('Verdi Trust API is running correctly!');
});

// API Routes

// Listings
app.get('/api/listings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/listings', async (req, res) => {
    const { project_source, volume, price, type, vintage, certificate_file, cover_image } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO listings (project_source, volume, price, type, vintage, status, fill_percentage, certificate_file, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [project_source, volume, price, type, vintage, 'In Review', 0, certificate_file, cover_image]
        );
        res.status(201).json({ id: result.insertId, ...req.body, status: 'In Review' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verification Endpoint
app.put('/api/listings/:id/verify', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE listings SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: `Listing status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM transactions ORDER BY transaction_date DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    const { buyer_name, credits, amount, status, razorpay_payment_id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO transactions (buyer_name, credits, amount, status, razorpay_payment_id, transaction_date) VALUES (?, ?, ?, ?, ?, NOW())',
            [buyer_name, credits, amount, status || 'Completed', razorpay_payment_id || null]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY joined_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)',
            [name, email, role, 'Active']
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/role', async (req, res) => {
    const { email, role } = req.body;
    try {
        await pool.query('UPDATE users SET role = ? WHERE email = ?', [role, email]);
        res.json({ message: 'User role updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Projects
app.get('/api/projects', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects ORDER BY submitted_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/projects/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE projects SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update listing
app.put('/api/listings/:id', async (req, res) => {
    const { project_source, volume, price, type, vintage, cover_image } = req.body;
    try {
        await pool.query(
            'UPDATE listings SET project_source = ?, volume = ?, price = ?, type = ?, vintage = ?, cover_image = ? WHERE id = ?',
            [project_source, volume, price, type, vintage, cover_image, req.params.id]
        );
        res.json({ message: 'Listing updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete listing
app.delete('/api/listings/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM listings WHERE id = ?', [req.params.id]);
        res.json({ message: 'Listing deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buyer Dashboard Stats
app.get('/api/buyer/stats', async (req, res) => {
    try {
        const [transactions] = await pool.query('SELECT SUM(credits) as totalCredits, SUM(amount) as totalSpent FROM transactions');
        const [activeListings] = await pool.query('SELECT COUNT(*) as activeCount FROM listings WHERE status = "Active"');

        res.json({
            totalCredits: transactions[0].totalCredits || 0,
            totalSpent: transactions[0].totalSpent || 0,
            activeProjects: activeListings[0].activeCount || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Notifications
app.get('/api/notifications', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/notifications/read', async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = TRUE');
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
