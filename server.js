const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/Image', express.static(path.join(__dirname, 'Image')));

// Database initialization
const db = new sqlite3.Database('./musketeers.db', (err) => {
    if (err) {
        console.error('Database opening error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        createTables();
    }
});

function createTables() {
    db.serialize(() => {
        // Products table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            price REAL,
            origPrice REAL,
            emoji TEXT,
            rating REAL,
            reviews INTEGER,
            stock INTEGER,
            desc TEXT,
            badge TEXT,
            isNew BOOLEAN
        )`);

        // Product Images table
        db.run(`CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            image_url TEXT,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`);

        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fname TEXT,
            lname TEXT,
            email TEXT UNIQUE,
            password TEXT,
            isAdmin BOOLEAN DEFAULT 0,
            joined TEXT
        )`);

        // Orders table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id INTEGER,
            total REAL,
            status TEXT,
            date TEXT,
            trackingStep INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Order Items table
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT,
            product_name TEXT,
            emoji TEXT,
            qty INTEGER,
            price REAL,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )`);

        // Cart table
        db.run(`CREATE TABLE IF NOT EXISTS cart (
            user_id INTEGER,
            product_id INTEGER,
            qty INTEGER,
            PRIMARY KEY (user_id, product_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`);

        // Wishlist table
        db.run(`CREATE TABLE IF NOT EXISTS wishlist (
            user_id INTEGER,
            product_id INTEGER,
            PRIMARY KEY (user_id, product_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`);

        // Coupons table
        db.run(`CREATE TABLE IF NOT EXISTS coupons (
            code TEXT PRIMARY KEY,
            type TEXT,
            value REAL,
            minOrder REAL,
            expiry TEXT,
            uses INTEGER
        )`);

        seedData();
    });
}

function seedData() {
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            const products = [
                { id: 1,  name: 'Pro Noise-Cancelling Headphones', category: 'Electronics', price: 8999.00, origPrice: 11999.00, emoji: '🎧', images: ['Image/wiwu-elite-white-on-ear-bluetooth-headphone-11730117950.webp'], rating: 4.8, reviews: 2341, stock: 45, desc: 'Premium wireless headphones with 40-hour battery life, active noise cancellation, and studio-quality sound.', badge: 'sale', isNew: 0 },
                { id: 2,  name: 'Smart Fitness Watch', category: 'Electronics', price: 3999.00, origPrice: 5999.00, emoji: '⌚', images: ['Image/s5-black.jpg'], rating: 4.6, reviews: 1823, stock: 30, desc: 'Track your health 24/7 with GPS, heart rate, sleep monitoring and 200+ workout modes.', badge: 'sale', isNew: 0 },
                { id: 3,  name: '4K Ultra HD Camera', category: 'Electronics', price: 35999.00, origPrice: 47999.00, emoji: '📷', images: ['Image/4K Ultra HD Camera.jpg'], rating: 4.9, reviews: 987, stock: 12, desc: 'Capture every moment in stunning 4K with 20MP sensor, optical zoom, and waterproof body.', badge: 'hot', isNew: 0 },
                { id: 4,  name: 'Leather Crossbody Bag', category: 'Fashion', price: 3499.00, origPrice: 4999.00, emoji: '👜', images: ['Image/Leather Crossbody Bag 1.webp', 'Image/Leather Crossbody Bag 2.webp'], rating: 4.5, reviews: 654, stock: 78, desc: 'Genuine leather crossbody bag with multiple compartments and adjustable strap. Perfect for everyday use.', badge: 'sale', isNew: 1 },
                { id: 5,  name: 'Running Sneakers Pro', category: 'Sports', price: 4999.00, origPrice: 6999.00, emoji: '👟', images: ['Image/Running Sneakers Pro 2.webp', 'Image/Running Sneakers Pro 3.jpg'], rating: 4.7, reviews: 3201, stock: 200, desc: 'Lightweight breathable running shoes with advanced cushioning and energy-return foam.', badge: '', isNew: 1 },
                { id: 6,  name: 'Bamboo Desk Organizer', category: 'Home & Garden', price: 1999.00, origPrice: 2999.00, emoji: '🪴', images: ['Image/Desk Organizer 1.webp', 'Image/Desk Organizer 2.jpg'], rating: 4.3, reviews: 445, stock: 150, desc: 'Eco-friendly bamboo desk organizer with 6 compartments. Keeps your workspace tidy and stylish.', badge: 'new', isNew: 1 },
                { id: 9,  name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 3999.00, origPrice: 5999.00, emoji: '⌨️', images: ['Image/Mechanical Gaming Keyboard 1.webp', 'Image/Mechanical Gaming Keyboard 2.webp'], rating: 4.7, reviews: 2109, stock: 60, desc: 'RGB mechanical keyboard with tactile switches, n-key rollover, and custom macros for gaming.', badge: 'sale', isNew: 0 },
                { id: 12, name: 'Smart LED Desk Lamp', category: 'Home & Garden', price: 2499.00, origPrice: 3499.00, emoji: '💡', images: ['Image/Smart LED Desk Lamp 2.webp'], rating: 4.4, reviews: 789, stock: 130, desc: 'Smart desk lamp with USB-C charging, adjustable color temperature, and gesture control.', badge: 'new', isNew: 1 },
                { id: 13, name: 'Retinol Night Cream', category: 'Beauty', price: 2299.00, origPrice: 3299.00, emoji: '🌙', rating: 4.7, reviews: 3289, stock: 240, desc: 'Anti-aging retinol night cream that reduces wrinkles and improves skin texture while you sleep.', badge: '', isNew: 0 },
                { id: 14, name: 'Wireless Earbuds TWS', category: 'Electronics', price: 3999.00, origPrice: 5999.00, emoji: '🎵', images: ['Image/IMG_1725.JPG', 'Image/IMG_1739.JPG', 'Image/IMG_1740(1).JPG'], rating: 4.6, reviews: 4512, stock: 50, desc: 'True wireless earbuds with 8-hour battery, touch controls, and IPX5 water resistance.', badge: 'sale', isNew: 0 },
                { id: 15, name: 'Minimalist Wallet', category: 'Fashion', price: 1499.00, origPrice: 1999.00, emoji: '💳', images: ['Image/Minimalist Wallet 1.jpg'], rating: 4.4, reviews: 1102, stock: 400, desc: 'Ultra-slim RFID-blocking wallet in genuine leather. Holds up to 12 cards.', badge: '', isNew: 1 },
                { id: 17, name: 'Thanos Key Ring', category: 'Accessories', price: 200.00, origPrice: 299.00, emoji: '🧲', images: ['Image/Thanos key ring.jpg'], rating: 4.4, reviews: 128, stock: 75, desc: 'Collector key ring inspired by Thanos, crafted with premium detail and lasting metal finish.', badge: 'new', isNew: 1 },
                { id: 18, name: 'Storm Breaker Key Ring', category: 'Accessories', price: 200.00, origPrice: 299.00, emoji: '⚒️', images: ['Image/Storm Breaker key ring.jpg'], rating: 4.5, reviews: 94, stock: 80, desc: 'Premium Storm Breaker key ring for fans, featuring detailed engraving and sturdy construction.', badge: 'new', isNew: 1 },
                { id: 19, name: 'Katana', category: 'Collectibles', price: 200.00, origPrice: 299.00, emoji: '🗡️', images: ['Image/katana 1.jpg', 'Image/katana 2.jpg'], rating: 4.6, reviews: 112, stock: 60, desc: 'Decorative katana replica with premium finish and collectible display quality.', badge: 'new', isNew: 1 },
                { id: 20, name: 'Gaming Chair Pro', category: 'Furniture', price: 12999.00, origPrice: 16999.00, emoji: '🪑', images: ['Image/gaming chair 1.webp', 'Image/gaming Chair 2.webp'], rating: 4.7, reviews: 856, stock: 35, desc: 'Premium ergonomic gaming chair with lumbar support, adjustable armrests, and premium synthetic leather. Perfect for long gaming sessions.', badge: 'new', isNew: 1 },
            ];

            const stmt = db.prepare(`INSERT INTO products (id, name, category, price, origPrice, emoji, rating, reviews, stock, desc, badge, isNew) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
            const imgStmt = db.prepare(`INSERT INTO product_images (product_id, image_url) VALUES (?,?)`);

            products.forEach(p => {
                stmt.run(p.id, p.name, p.category, p.price, p.origPrice, p.emoji, p.rating, p.reviews, p.stock, p.desc, p.badge, p.isNew);
                if (p.images) {
                    p.images.forEach(img => imgStmt.run(p.id, img));
                }
            });

            stmt.finalize();
            imgStmt.finalize();
            console.log('Seeded products.');
        }
    });

    db.get("SELECT COUNT(*) as count FROM coupons", (err, row) => {
        if (row.count === 0) {
            const coupons = [
                { code: 'SUMMER30', type: 'percent', value: 30, minOrder: 0, expiry: '2025-12-31', uses: 234 },
                { code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0, expiry: '2025-12-31', uses: 891 },
                { code: 'SAVE20', type: 'fixed', value: 2400, minOrder: 12000, expiry: '2025-09-30', uses: 103 },
                { code: 'FREESHIP', type: 'fixed', value: 1198.80, minOrder: 6000, expiry: '2025-08-31', uses: 412 },
            ];
            const stmt = db.prepare(`INSERT INTO coupons (code, type, value, minOrder, expiry, uses) VALUES (?,?,?,?,?,?)`);
            coupons.forEach(c => stmt.run(c.code, c.type, c.value, c.minOrder, c.expiry, c.uses));
            stmt.finalize();
            console.log('Seeded coupons.');
        }
    });

    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (row.count === 0) {
            // Admin user
            db.run(`INSERT INTO users (fname, lname, email, password, isAdmin, joined) VALUES (?,?,?,?,?,?)`, 
                ['Admin', 'User', 'admin@musketeers.com', 'admin123', 1, new Date().toISOString()]);
            console.log('Seeded admin user.');
        }
    });
}

// APIs

// Products
app.get('/api/products', (req, res) => {
    db.all(`SELECT p.*, GROUP_CONCAT(pi.image_url) as images 
            FROM products p 
            LEFT JOIN product_images pi ON p.id = pi.product_id 
            GROUP BY p.id`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const products = rows.map(r => ({
            ...r,
            images: r.images ? r.images.split(',') : [],
            isNew: !!r.isNew
        }));
        res.json(products);
    });
});

// Auth
app.post('/api/auth/register', (req, res) => {
    const { fname, lname, email, password } = req.body;
    db.run(`INSERT INTO users (fname, lname, email, password, joined) VALUES (?,?,?,?,?)`,
        [fname, lname, email, password, new Date().toISOString()],
        function(err) {
            if (err) return res.status(400).json({ error: 'Email already exists' });
            res.json({ id: this.lastID, fname, lname, email, isAdmin: false });
        }
    );
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
        delete user.password;
        res.json(user);
    });
});

// Cart
app.get('/api/cart/:userId', (req, res) => {
    db.all(`SELECT product_id as id, qty FROM cart WHERE user_id = ?`, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/cart/:userId', (req, res) => {
    const { product_id, qty } = req.body;
    db.run(`INSERT OR REPLACE INTO cart (user_id, product_id, qty) VALUES (?,?,?)`,
        [req.params.userId, product_id, qty],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.delete('/api/cart/:userId/:productId', (req, res) => {
    db.run(`DELETE FROM cart WHERE user_id = ? AND product_id = ?`, [req.params.userId, req.params.productId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Wishlist
app.get('/api/wishlist/:userId', (req, res) => {
    db.all(`SELECT product_id FROM wishlist WHERE user_id = ?`, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => r.product_id));
    });
});

app.post('/api/wishlist/:userId', (req, res) => {
    const { product_id } = req.body;
    db.run(`INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?,?)`, [req.params.userId, product_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/wishlist/:userId/:productId', (req, res) => {
    db.run(`DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`, [req.params.userId, req.params.productId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Orders
app.get('/api/orders/:userId', (req, res) => {
    db.all(`SELECT * FROM orders WHERE user_id = ? ORDER BY date DESC`, [req.params.userId], (err, orders) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const orderIds = orders.map(o => o.id);
        if (orderIds.length === 0) return res.json([]);

        db.all(`SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`, orderIds, (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const ordersWithItems = orders.map(o => ({
                ...o,
                items: items.filter(i => i.order_id === o.id)
            }));
            res.json(ordersWithItems);
        });
    });
});

app.post('/api/orders', (req, res) => {
    const { id, user_id, total, status, date, trackingStep, items } = req.body;
    db.serialize(() => {
        db.run(`INSERT INTO orders (id, user_id, total, status, date, trackingStep) VALUES (?,?,?,?,?,?)`,
            [id, user_id, total, status, date, trackingStep]);
        
        const stmt = db.prepare(`INSERT INTO order_items (order_id, product_name, emoji, qty, price) VALUES (?,?,?,?,?)`);
        items.forEach(item => stmt.run(id, item.name, item.emoji, item.qty, item.price));
        stmt.finalize();

        // Clear cart
        db.run(`DELETE FROM cart WHERE user_id = ?`, [user_id]);

        res.json({ success: true, orderId: id });
    });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
    db.get(`SELECT 
        (SELECT COUNT(*) FROM orders) as totalOrders,
        (SELECT SUM(total) FROM orders) as totalRevenue,
        (SELECT COUNT(*) FROM products) as totalProducts,
        (SELECT COUNT(*) FROM users) as totalCustomers`, (err, stats) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(stats);
    });
});

// Users
app.put('/api/users/:id', (req, res) => {
    const { fname, lname, email } = req.body;
    db.run(`UPDATE users SET fname = ?, lname = ?, email = ? WHERE id = ?`,
        [fname, lname, email, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
