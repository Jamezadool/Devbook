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
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
//         const user = rows[0];
//         const valid = user && await bcrypt.compare(password, user.password);
        
//         if (!valid) {
//             return res.status(401).json({ success: false, error: 'Invalid credentials' });
//         }

//         const token = jwt.sign(
//             { id: user.id, email: user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.json({ success: true, token });

//     } catch (err) {
//         console.error('Login error:', err);  // log full error
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// app.post('/signup', async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
//         if (rows.length > 0) {
//             return res.status(409).json({ success: false, error: "Email has already been used." });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         await pool.execute("INSERT INTO users(username, email, password) VALUES(?, ?, ?)", [username, email, hashedPassword]);

//         res.status(200).json({ success: true, message: "Signup successful, you can now login using your email address." });

//     } catch (err) {
//         console.error('Login error:', err);  // log full error
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// app.get('/authorize', authenticateToken, (req, res) => {
//     res.json({ success: true, message: "Verified successfully" });
// });

// app.post('/post', authenticateToken, async (req, res) => {
//     const { content, imageUrl } = req.body;
//     const userId = req.user.id; 

//     try {
//         await pool.execute(
//             'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
//             [userId, content, imageUrl]
//         );
//         res.status(200).json({ success: true, message: "Post created" });
//     } catch (err) {
//         console.error('Login error:', err);  // log full error
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// app.get('/posts', async (req, res) => {
//     let limit = parseInt(req.query.limit, 10);
//     let offset = parseInt(req.query.offset, 10);

//     // Fallback values
//     if (isNaN(limit) || limit <= 0) limit = 5;
//     if (isNaN(offset) || offset < 0) offset = 0;

//     console.log("Limit:", limit, "Offset:", offset);

//     try {
//         // Use string interpolation for LIMIT/OFFSET (they're safe since you parsed them as ints)
//         const query = `
//             SELECT posts.id, posts.content, posts.image_url, posts.created_at, users.username
//             FROM posts
//             JOIN users ON posts.user_id = users.id
//             ORDER BY posts.created_at DESC
//             LIMIT ${limit} OFFSET ${offset}
//         `;

//         const [rows] = await pool.query(query);

//         res.json({ success: true, posts: rows });
//     } catch (err) {
//         console.error("Error in GET /posts:", err.message);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });


// //thid fetchs the post and comment for single page post and comment
// app.get('/post/:id', async(req, res) => {
//     const { id } = req.params;

//     try{
//         const [[post]] = await pool.execute("SELECT posts.id, posts.content, posts.image_url, posts.created_at, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?", [id]);

//         if(!post) return res.status(404).json({success: false, error: "Post not found"});

//         const [commentsData] = await pool.execute("SELECT comments.id, comments.content, comments.created_at, users.username FROM comments JOIn users ON comments.user_id = users.id WHERE comments.post_id = ?", [id]);

//         res.status(200).json({success: true, post, commentsData});
//     }catch(err){
//         console.error('Login error:', err);  // log full error
//         res.status(500).json({success: false, error: err.message});
//     }
// });

// //this is to add comment to the database
// app.post("/comment", authenticateToken, async (req, res) => {
//     const { content , postId } = req.body;
//     const userId = req.user.id;

//     try{
//         if(!content || !postId) return res.status(500).send({success:false, error: "Try again later, If issue not fixed, please login again."});

//         await pool.execute("INSERT INTO comments(post_id, user_id, content) VALUES(?, ?, ?)", [postId, userId, content]);
//         res.status(200).send({success: true, message: "Comment Posted"});
//     }catch(err){
//         console.error('Login error:', err);  // log full error
//         res.status(500).send({success: false, error: err.message});
//     }
// });
// //get username
// app.get('/me', authenticateToken, async (req, res) => {
//     const userId = req.user.id;

//     try {
//         const [rows] = await pool.execute(`
//             SELECT u.username, p.full_name
//             FROM users u
//             LEFT JOIN profiles p ON u.id = p.user_id
//             WHERE u.id = ?
//         `, [userId]);

//         if (rows.length === 0) {
//             return res.status(404).json({ success: false, error: 'User not found' });
//         }

//         res.json({
//             success: true,
//             username: rows[0].username,
//             full_name: rows[0].full_name
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// //for admin panel
// app.get('/fetchnewclients', async (req, res) => {
//     try{
//         const [[{totalNewClients}]] = await pool.execute("SELECT COUNT(*) AS totalNewClients FROM users");
//         res.status(200).send({success: true, totalNewClients});
//     }catch(err){
//         console.log(err.message);
//         res.status(400).send({success: false, error : err.message});
//     }
// });
// app.get('/fetchusers', async (req, res) => {
//     try{
//         const [[{totalusers}]] = await pool.execute("SELECT COUNT(*) AS totalusers FROM users");
//         res.status(200).send({success:true, totalusers});
//     }catch(err){
//         console.log(err);
//         res.status(400).send({success: false, error: err.message});
//     }
// })

// app.get('/postcount', async (req, res) => {
//     try{
//         const [[{postscount}]] = await pool.execute("SELECT COUNT(*) AS postscount FROM posts");
//         res.status(200).send({success: true, postscount});
//     }catch(err){
//         console.log(err.message);
//         res.status(400).send({success:false, error: err.message});
//     }
// });



// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });

//Check Login Username And Password
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
            { expiresIn: '5h' }
        );

        res.json({ success: true, token });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        console.log(err);
    }
});

//Signing up using email and password
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) return res.status(409).send({success: false, error: "No input field should be empty"});

        const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, error: "Email has already been used." });
        }

        const [usernameExisting] = await pool.execute("SELECT id FROM users WHERE username = ?", [username]);
        if (usernameExisting.length > 0){
            return res.status(409).json({ success: false, error: "Username in has already been taken"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [userInsert] = await pool.execute(
            "INSERT INTO users(username, email, password) VALUES(?, ?, ?)",
            [username, email, hashedPassword]
        );

        const userId = userInsert.insertId;

        // Create an empty profile for the new user
        await pool.execute(
            "INSERT INTO profiles(user_id, full_name, bio, profile_pic, location) VALUES(?, '', '', '', '')",
            [userId]
        );

        res.status(200).json({
            success: true,
            message: "Signup successful, you can now login using your email address."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// fetching current user username
app.post('/username', async (req, res) => {
    const { userName } = req.body;
    try {
        if (!userName) return res.status(400).send({ success: false, error: "Username cannot be empty" });

        const [usernameExists] = await pool.execute("SELECT id FROM users WHERE username = ?", [userName]);
        if (usernameExists.length > 0){
            return res.status(409).json({ success: false, error: "Username in already taken"});
        }

        res.status(200).send({success: true, message: "Username is available"});
    }catch (err) {
        console.log(err.message);
        res.status(400).send({success: false, error: err.message});
    }
});
// this is a locked url, without login, they can't access for example index.html, we can also lock the profile page any page really
app.get('/authorize', authenticateToken, (req, res) => {
    res.json({ success: true, message: "Verified successfully" });
});

// This allows the sending of posts from users 
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
        res.status(500).json({ success: false, error: err.message });
    }
});
//  This shows post on the homepage
app.get('/posts', async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;

    try {
        if (offset < 0 || limit < 1)
            return res.status(400).send({ success: false, error: "invalid offset or limit" });

        const [rows] = await pool.execute(`
            SELECT posts.id, posts.content, posts.image_url, posts.created_at, users.username, COUNT(comments.id) AS comment_count
            FROM posts
            JOIN users ON posts.user_id = users.id
            LEFT JOIN comments ON comments.post_id = posts.id
            GROUP BY posts.id
            ORDER BY posts.created_at DESC
            LIMIT ?, ?
        `, [offset, limit]); // ⬅ swapped

        res.json({ success: true, posts: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//this fetches the post and comment for single page post and comment
app.get('/post/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [[post]] = await pool.execute("SELECT posts.id, posts.content, posts.image_url, posts.created_at, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?", [id]);

        if (!post) return res.status(404).json({ success: false, error: "Post not found" });

        const [commentsData] = await pool.execute("SELECT comments.id, comments.content, comments.created_at, users.username FROM comments JOIn users ON comments.user_id = users.id WHERE comments.post_id = ?", [id]);

        res.status(200).json({ success: true, post, commentsData });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//this is to add comment to the database
app.post("/comment", authenticateToken, async (req, res) => {
    const { content, postId } = req.body;
    const userId = req.user.id;

    try {
        if (!content || !postId) return res.status(500).send({ success: false, error: "Try again later, If issue not fixed, please login again." });

        await pool.execute("INSERT INTO comments(post_id, user_id, content) VALUES(?, ?, ?)", [postId, userId, content]);
        res.status(200).send({ success: true, message: "Comment Posted" });
    } catch (err) {
        res.status(500).send({ success: false, error: err.message });
    }
});

//get username for profiles, however i've not created the profile so it won't work
app.get('/me', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await pool.execute(`
            SELECT u.username, p.full_name
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.id = ?
        `, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({
            success: true,
            username: rows[0].username,
            full_name: rows[0].full_name
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//for admin panel to see the number o new clients
app.get('/fetchnewclients', async (req, res) => {
    try {
        const [[{ totalNewClients }]] = await pool.execute("SELECT COUNT(*) AS totalNewClients FROM users");
        res.status(200).send({ success: true, totalNewClients });
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ success: false, error: err.message });
    }
});
app.get('/fetchusers', async (req, res) => {
    try {
        const [[{ totalusers }]] = await pool.execute("SELECT COUNT(*) AS totalusers FROM users");
        res.status(200).send({ success: true, totalusers });
    } catch (err) {
        console.log(err);
        res.status(400).send({ success: false, error: err.message });
    }
});
// the number of posts on the page, for admin only
app.get('/postcount', async (req, res) => {
    try {
        const [[{ postscount }]] = await pool.execute("SELECT COUNT(*) AS postscount FROM posts");
        res.status(200).send({ success: true, postscount });
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ success: false, error: err.message });
    }
});

//deleting posts
// app.post('/deletepost', authenticateToken, async (req, res) => {
//     const { postId } = req.body;
//     const userId = req.user.id;


//     try{
//         if(!postId) return res.status(400).send({success:false, error: "cannot delete post"});

//         await pool.execute("DELETE * FROM posts WHERE post_id = ?" , [userId]);
//         res.status(200).send({success: true, message: "Deleted successfully"});

//     }catch(err){
//         console.log(err.message);
//         res.status(400).send({success: false, error: err.message});
//     }
// });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
