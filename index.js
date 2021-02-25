const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const SERVER_PORT = 7777;
const JWT_SECRET = 'mamacoquerbanana';

const app = express();
app.use(bodyParser.json());

// JWT validation
const secureRouteMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({
                message: err.message
            });
            return;
        }
        req.user = decoded;
        next();
    });
};

// Routes
const loadRoutes = (conn) => {

    // Authentication
    app.post("/login", async (req, res) => {
        const { username, password} = req.body;
        try {
            const [rows] = await conn.query(`SELECT * FROM users WHERE username = '${username}'`);

            if (rows.length === 0) {
                res.status(404).json({
                    message: "Usuário não encontrado"
                });
                return;
            }

            const [user] = rows;
            if (password !== user.password) {
                res.status(404).json({
                    message: "Senha incorreta"
                });
                return;
            }

            jwt.sign({
                id: user.id,
                username: user.username
            }, JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
                if (err) {
                    res.status(401).json({
                        message: "Acesso negado"
                    });
                    return;
                }
                res.json(token);
            });

        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });

    // List an user's investments
    app.get("/investment", secureRouteMiddleware, async (req, res) => {
        try {
            const { user } = req;
            const [rows] = await conn.query(`SELECT * FROM investments WHERE user_id = '${user.id}'`);
            res.json(rows);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });

    // Insert an user's investment
    app.post("/investment", secureRouteMiddleware, async (req, res) => {
        try {
            const { user, body: { type, value, date }} = req;
            const [rows] = await conn.query(`INSERT INTO investments (type, value, date, user_id) VALUES ('${type}', '${value}', '${date}', '${user.id}')`);
            res.json(rows);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });

    // Delete an user's investment
    app.delete("/investment/:id", secureRouteMiddleware, async (req, res) => {
        try {
            const { user, params: { id }} = req;
            const [userInvestments] = await conn.query(`SELECT * FROM investments WHERE user_id = ${user.id} AND id = ${id}`);

            if (userInvestments.length === 0) {
                res.status(403).json({
                    message: "Operação negada"
                });
                return;
            }

            const [rows] = await conn.query(`DELETE FROM investments WHERE id = ${id}`);
            res.json(rows);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
}

// Start the server
app.listen(SERVER_PORT, async () => {
    try {
        // Database connection
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'gorila'
        });

        console.log(`Server is up at port ${SERVER_PORT}`);
        loadRoutes(connection);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});