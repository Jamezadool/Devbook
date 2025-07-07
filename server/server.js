const express = require('express');
const mysql = require('mysql2/promise');
require("dotenv").config();
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const pool = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit:0
})
const jwt = require('jsonwebtoken');
const port = process.env.PORT;
const path = require('path');
const app = express();
app.use(express.json());
// CORS configuration
const corsOptions = {
  origin: true, // This allows all origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc)
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try{
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWTSECRETKEY,
            { expiresIn: '1h' }
        )
        res.json({success: true, token});

    }catch(err){
        res.send({success: false, error: err.message});
        next(err);
    }
})

//middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/', authenticateToken, (req, res) => {
    res.json({ success: true, message: `Hello ${req.user.email}` });
});

app.post('/signup', async (req, res) => {
    // res.status(200).send({success: true, message: "signup successful"});
    const { username, email, password } = req.body;

    try{
        //checking it the email already existed.
        const [ rows ] = await pool.execute("SELECT * FROM users WHERE email = ? ", [email]);
        if(rows.length > 0) return res.status(409).send({success: false, error: "Email has already been used."});
        //End of check.

        const mailingEmail = email;
        //we should send an email to the user before allowing them in.


        // const hashedPassword = await bcrypt.hash(password, 10);
        // //insert the users details into the database.
        // const result = await pool.execute("INSERT INTO users(name, email, password) VALUES(?, ?, ?)", [username, email, hashedPassword]);
        // res.status(200).send({success: true, message: "Signup successful, you can now login using your email address."});

    }catch(err){
        res.status(409).send({success: false, error: err.message});
    }
})
app.listen(port, () => console.log("connection started at http://localhost:3000"));