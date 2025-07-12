const express = require('express');
const mysql = require('mysql2/promise');
require("dotenv").config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});
app.get('/my-ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.send(`Render IP: ${ip}`);
});

app.use(express.json());

const corsOptions = {
    origin: 'https://devnote.bluhorizon.work',
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];
        const valid = user && await bcrypt.compare(password, user.password);
        
        if (!valid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, token });

    } catch (err) {
        console.error('Login error:', err);  // log full error
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(409).json({ success: false, error: "Email has already been used." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute("INSERT INTO users(username, email, password) VALUES(?, ?, ?)", [username, email, hashedPassword]);

        res.status(200).json({ success: true, message: "Signup successful, you can now login using your email address." });

    } catch (err) {
        console.error('Login error:', err);  // log full error
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/authorize', authenticateToken, (req, res) => {
    res.json({ success: true, message: "Verified successfully" });
});

app.post('/post', authenticateToken, async (req, res) => {
    const { content, imageUrl } = req.body;
    const userId = req.user.id; 

    try {
        await pool.execute(
            'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
            [userId, content, imageUrl]
        );
        res.status(200).json({ success: true, message: "Post created" });
    } catch (err) {
        console.error('Login error:', err);  // log full error
        res.status(500).json({ success: false, error: err.message });
    }
});



app.get('/posts', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT posts.id, posts.content, posts.image_url, posts.created_at, users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
        `);
        res.json({ success: true, posts: rows });
    } catch (err) {
        console.error('Login error:', err);  // log full error
        res.status(500).json({ success: false, error: err.message });
    }
});


//thid fetchs the post and comment for single page post and comment
app.get('/post/:id', async(req, res) => {
    const { id } = req.params;

    try{
        const [[post]] = await pool.execute("SELECT posts.id, posts.content, posts.image_url, posts.created_at, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?", [id]);

        if(!post) return res.status(404).json({success: false, error: "Post not found"});

        const [commentsData] = await pool.execute("SELECT comments.id, comments.content, comments.created_at, users.username FROM comments JOIn users ON comments.user_id = users.id WHERE comments.post_id = ?", [id]);

        res.status(200).json({success: true, post, commentsData});
    }catch(err){
        console.error('Login error:', err);  // log full error
        res.status(500).json({success: false, error: err.message});
    }
});

//this is to add comment to the database
app.post("/comment", authenticateToken, async (req, res) => {
    const { content , postId } = req.body;
    const userId = req.user.id;

    try{
        if(!content || !postId) return res.status(500).send({success:false, error: "Try again later, If issue not fixed, please login again."});

        await pool.execute("INSERT INTO comments(post_id, user_id, content) VALUES(?, ?, ?)", [postId, userId, content]);
        res.status(200).send({success: true, message: "Comment Posted"});
    }catch(err){
        console.error('Login error:', err);  // log full error
        res.status(500).send({success: false, error: err.message});
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
