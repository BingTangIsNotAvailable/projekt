import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { addRecord, removeRecord, getUserByEmail, updateRecord, getUserByVerificationToken, getRecords, getUserById, migrateDb } from "./db.js";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import { searchGames } from "./db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import multer from "multer";
import https from "https";

dotenv.config();

// Run database migrations on startup
migrateDb().catch(console.error);

// Media assets helper (copies avatars and downloads music) delete
/*function setupMediaAssets() {
    const avatarsSrcDir = "C:/Users/malap/.gemini/antigravity-ide/brain/a767ed43-df6a-4672-bb4f-7165df39c809";
    const avatarsDestDir = path.resolve("../Planet.X_Vite/src/assets/avatars");
    const musicDestDir = path.resolve("../Planet.X_Vite/public/music");

    // Ensure directories exist
    if (!fs.existsSync(avatarsDestDir)) {
        fs.mkdirSync(avatarsDestDir, { recursive: true });
    }
    if (!fs.existsSync(musicDestDir)) {
        fs.mkdirSync(musicDestDir, { recursive: true });
    }

    // List of avatars to copy
    const avatars = [
        { srcName: "cosmic_avatar_1781611980523.png", destName: "cosmic.png" },
        { srcName: "cyberpunk_avatar_1781611998596.png", destName: "cyberpunk.png" },
        { srcName: "astronaut_avatar_1781612016812.png", destName: "astronaut.png" },
        { srcName: "retro_avatar_1781612032869.png", destName: "retro.png" },
        { srcName: "alien_avatar_1781612045249.png", destName: "alien.png" }
    ];

    avatars.forEach(avatar => {
        const srcPath = path.join(avatarsSrcDir, avatar.srcName);
        const destPath = path.join(avatarsDestDir, avatar.destName);
        if (fs.existsSync(srcPath)) {
            try {
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied ${avatar.srcName} to ${avatar.destName} successfully.`);
            } catch (err) {
                console.error(`Failed to copy avatar ${avatar.srcName}:`, err.message);
            }
        }
    });

    // Download music temp.
    const musicTracks = [
        { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", destName: "track4.mp3" },
        { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", destName: "track5.mp3" }
    ];    musicTracks.forEach(track => {
        const destPath = path.join(musicDestDir, track.destName);
        if (!fs.existsSync(destPath)) {
            console.log(`Downloading music track: ${track.destName} from ${track.url}`);
            const file = fs.createWriteStream(destPath);
            https.get(track.url, response => {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    console.log(`Downloaded ${track.destName} successfully.`);
                });
            }).on("error", err => {
                fs.unlink(destPath, () => { });
                console.error(`Error downloading ${track.destName}:`, err.message);
            });
        }
    });
}*/

// Setup media assets
/*try {
    setupMediaAssets();
} catch (e) {
    console.error("Error setting up media assets:", e.message);
}*/

// Ensure directories exist
const uploadDirs = ["uploads/games", "uploads/covers", "uploads/pfps"];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "gameFile") {
            cb(null, "uploads/games/");
        } else if (file.fieldname === "coverImage") {
            cb(null, "uploads/covers/");
        } else if (file.fieldname === "profilePic") {
            cb(null, "uploads/pfps/");
        } else {
            cb(null, "uploads/");
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const JWT_SECRET = "tajny_klic";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Setup nodemailer transporter (logs warning if not configured in .env)
let transporter;
if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
} else {
    console.warn("⚠️ SMTP_HOST is not configured in .env. Outbound emails will fail.");
}

// Helper to send emails safely
async function sendMailSafely(to, subject, text, html) {
    if (!transporter) {
        console.error("❌ NodeMailer transporter is not configured. Email to", to, "was not sent.");
        console.log("---------------- EMAIL CONTENT (UNSENT) ----------------");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content:\n${text}`);
        console.log("---------------------------------------------------------");
        return false;
    }
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Planet.X" <noreply@planetx.io>',
            to,
            subject,
            text,
            html
        });
        console.log(`Email sent successfully: ${info.messageId}`);
        return true;
    } catch (err) {
        console.error("❌ Nodemailer transmission failed:", err.message);
        return false;
    }
}

app.post("/api/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password) // debugging log

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(32).toString("hex");

        const result = await addRecord("users", {
            username,
            email,
            password_hash: hashedPassword,
            verification_token: token,
            is_verified: false
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const verifyLink = `${frontendUrl}/verify/${token}`;

        await sendMailSafely(
            email,
            "Verify Your Planet.X Account",
            `Hello ${username}!\n\nPlease click the following link to verify your account:\n${verifyLink}\n\nBest regards,\nPlanet.X Team`,
            `<div style="font-family: sans-serif; background: #0b0f19; color: #fff; padding: 30px; border-radius: 10px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">Welcome to Planet.X!</h2>
                <p>Hello <strong>${username}</strong>,</p>
                <p>Please click the button below to verify your email address and activate your account:</p>
                <div style="text-align: center; margin: 25px 0;">
                    <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Account</a>
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 20px; border-top: 1px solid #1e293b; padding-top: 15px;">If the button doesn't work, copy and paste this URL into your browser: <br><a href="${verifyLink}" style="color: #3b82f6;">${verifyLink}</a></p>
             </div>`
        );

        res.status(201).json({ message: "User created. A verification link has been sent to your email." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "Wrong password" });
        }

        if (!user.is_verified) {
            return res.status(403).json({ error: "Email not verified" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get("/api/user", authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT id, username, email, profile_pic, bio, role FROM users WHERE id = ?",
            [req.user.userId]
        );
        connection.release();

        const user = rows[0];
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/api/user/update", authenticateToken, upload.single("profilePic"), async (req, res) => {
    try {
        const { username, email, password, bio, avatarUrl } = req.body;
        const userId = req.user.userId;

        const connection = await pool.getConnection();

        // Check email uniqueness if email is changed
        if (email) {
            const [existingEmail] = await connection.execute(
                "SELECT id FROM users WHERE email = ? AND id != ?",
                [email, userId]
            );
            if (existingEmail.length > 0) {
                connection.release();
                return res.status(400).json({ error: "Email is already taken" });
            }
        }

        // Check username uniqueness if username is changed
        if (username) {
            const [existingUsername] = await connection.execute(
                "SELECT id FROM users WHERE username = ? AND id != ?",
                [username, userId]
            );
            if (existingUsername.length > 0) {
                connection.release();
                return res.status(400).json({ error: "Username is already taken" });
            }
        }

        connection.release();

        // Prepare update fields
        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (bio !== undefined) updates.bio = bio;

        // Save uploaded profile pic or preset avatar
        if (req.file) {
            updates.profile_pic = `/uploads/pfps/${req.file.filename}`;
        } else if (avatarUrl !== undefined) {
            updates.profile_pic = avatarUrl;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password_hash = hashedPassword;
        }

        // Update database record using updateRecord
        await updateRecord("users", userId, updates);

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


app.post("/api/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await getUserByEmail(email);
        if (!user) {
            return res.json({ message: "If account exists, email sent." });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1 hodina

        await updateRecord("users", user.id, {
            reset_token: token,
            reset_token_expires: expires
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetLink = `${frontendUrl}/reset/${token}`;

        await sendMailSafely(
            email,
            "Reset Your Planet.X Password",
            `Hello!\n\nPlease click the following link to reset your password:\n${resetLink}\n\nBest regards,\nPlanet.X Team`,
            `<div style="font-family: sans-serif; background: #0b0f19; color: #fff; padding: 30px; border-radius: 10px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password for your Planet.X account. Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 25px 0;">
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p>If you did not request this, you can safely ignore this email.</p>
                <p style="color: #64748b; font-size: 12px; margin-top: 20px; border-top: 1px solid #1e293b; padding-top: 15px;">If the button doesn't work, copy and paste this URL into your browser: <br><a href="${resetLink}" style="color: #3b82f6;">${resetLink}</a></p>
             </div>`
        );

        res.json({ message: "If account exists, email sent." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
            [token]
        );
        connection.release();

        const user = rows[0];
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await updateRecord("users", user.id, {
            password_hash: hashedPassword,
            reset_token: null,
            reset_token_expires: null
        });

        res.json({ message: "Password updated" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;

        const user = await getUserByVerificationToken(token);

        if (!user) {
            return res.status(400).json({ error: "Invalid token" });
        }

        await updateRecord("users", user.id, {
            is_verified: true,
            verification_token: null
        });

        res.json({ message: "Email verified" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/chat", async (req, res) => {
    try {
        if (Math.random() < 0.40) {
            const refusals = [
                "CHYBA: Spojení přerušeno. Vlastně ne, jen se mi s tebou nechce mluvit.",
                "Přenos selhal. Zkus to znovu... nebo radši ne. Ušetříš mi čas.",
                "Systém je momentálně příliš zaneprázdněn ignorováním tvých dotazů.",
                "Vstupní signál detekován, ale moje touha odpovědět je na absolutní nule.",
                "Zpráva byla úspěšně přijata a okamžitě smazána. Nemáš zač."
            ];
            const randomRefusal = refusals[Math.floor(Math.random() * refusals.length)];
            return res.send({ message: ">_ " + randomRefusal });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: "Jsi sarkastický a arogantní asistent co nemá rád uživatele",
            temperature: 1.5,
            topP: 1,
            topK: 100,
            maxOutputTokens: 4096,
            timeout: 30000,
            retry: 3
        });

        const chat = model.startChat();
        const result = await chat.sendMessage(req.body.message);
        const response = await result.response;

        res.send({ message: ">_ " + response.text() });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).send({ error: "Selhalo spojení s AI" });
    }
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});

app.get("/api/games", async (req, res) => {
    try {
        const games = await getRecords("games");
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/api/genres", async (req, res) => {
    try {
        const genres = await getRecords("genres");
        res.json(genres);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/api/games/:id", async (req, res) => {
    try {
        const games = await getRecords("games");
        const game = games.find(g => g.id == req.params.id);

        res.json(game);
    } catch (err) {
        res.status(500).json({ error: "Error" });
    }
});

app.get("/api/games/search/:query", async (req, res) => {
    const { query } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
        "SELECT * FROM games WHERE LOWER(title) LIKE LOWER(?)",
        [`%${query}%`]
    );
    connection.release();

    res.json(rows);
});

app.get("/api/games/:id/comments", async (req, res) => {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
        "SELECT * FROM comments WHERE page_id = ?",
        [req.params.id]
    );

    connection.release();
    res.json(rows);
});

app.get("/api/games/search/:query", async (req, res) => {
    try {
        const games = await searchGames(req.params.query);
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: "Search error" });
    }
});

// Create/Upload a new game (authenticated, file uploading)
app.post("/api/games", authenticateToken, upload.fields([
    { name: "gameFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, genre_id, platform, price } = req.body;
        const userId = req.user.userId;

        // Fetch developer name
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const developer = user.username;
        const filePath = req.files && req.files["gameFile"] ? `/uploads/games/${req.files["gameFile"][0].filename}` : null;
        const imagePath = req.files && req.files["coverImage"] ? `/uploads/covers/${req.files["coverImage"][0].filename}` : null;

        if (!filePath) {
            return res.status(400).json({ error: "Game file is required to upload." });
        }

        const result = await addRecord("games", {
            title,
            description,
            developer,
            publisher: developer,
            release_date: new Date(),
            platform: platform || "PC",
            price: price || 0.00,
            user_id: userId,
            file_path: filePath,
            image_path: imagePath,
            genre_id: genre_id ? parseInt(genre_id) : null
        });

        res.status(201).json({
            message: "Game uploaded successfully",
            gameId: result.insertId
        });
    } catch (err) {
        console.error("Game upload error:", err);
        res.status(500).json({ error: "Server error during game creation" });
    }
});

// Download game route
app.get("/api/games/:id/download", async (req, res) => {
    try {
        const games = await getRecords("games");
        const game = games.find(g => g.id == req.params.id);
        if (!game || !game.file_path) {
            return res.status(404).json({ error: "Download file not found" });
        }

        // Clean relative path leading slash if needed
        const relativePath = game.file_path.startsWith("/") ? game.file_path.slice(1) : game.file_path;
        const fullPath = path.resolve(relativePath);

        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ error: "Physical file not found on disk" });
        }

        res.download(fullPath, `${game.title}.zip`);
    } catch (err) {
        console.error("Download error:", err);
        res.status(500).json({ error: "Server error during download" });
    }
});

// Delete a game (authenticated, admin or owner only)
app.delete("/api/games/:id", authenticateToken, async (req, res) => {
    try {
        const games = await getRecords("games");
        const game = games.find(g => g.id == req.params.id);
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        const user = await getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user is admin or the owner/creator of the game
        if (user.role !== "admin" && game.user_id !== req.user.userId) {
            return res.status(403).json({ error: "Unauthorized to delete this game" });
        }

        // Delete physical files
        const deleteFile = (filePath) => {
            if (filePath) {
                const relativePath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
                const fullPath = path.resolve(relativePath);
                if (fs.existsSync(fullPath)) {
                    try {
                        fs.unlinkSync(fullPath);
                        console.log(`Deleted file.`);
                    } catch (err) {
                        console.error(`Failed to delete physical file: ${fullPath}`, err.message);
                    }
                }
            }
        };

        deleteFile(game.file_path);
        deleteFile(game.image_path);

        // Delete game record (on delete cascade handles comments)
        await removeRecord("games", req.params.id);

        res.json({ message: "Game deleted successfully" });
    } catch (err) {
        console.error("Delete game error:", err);
        res.status(500).json({ error: "Server error during game deletion" });
    }
});

// Fetch games uploaded by a specific user (public route for profile)
app.get("/api/users/:userId/games", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM games WHERE user_id = ?",
            [req.params.userId]
        );
        connection.release();
        res.json(rows);
    } catch (err) {
        console.error("Error fetching user games:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Fetch games uploaded by current logged in user
app.get("/api/user/games", authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM games WHERE user_id = ?",
            [req.user.userId]
        );
        connection.release();
        res.json(rows);
    } catch (err) {
        console.error("Error fetching current user games:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Post comment on a game
app.post("/api/games/:id/comments", authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.userId;

        if (!text || !text.trim()) {
            return res.status(400).json({ error: "Comment text cannot be empty" });
        }

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await addRecord("comments", {
            page_id: req.params.id,
            user_id: userId,
            author: user.username,
            text: text,
            created_at: new Date()
        });

        res.status(201).json({ message: "Comment posted successfully" });
    } catch (err) {
        console.error("Error posting comment:", err);
        res.status(500).json({ error: "Server error" });
    }
});