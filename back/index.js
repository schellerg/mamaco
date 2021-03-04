const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require('cors');
const mathjs = require('mathjs');
const mysql = require("mysql2/promise");

const SERVER_PORT = 7777;
const JWT_SECRET = 'mamacoquerbanana';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// JWT validation
const secureRouteMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    const token = (authorization).replace("Bearer ", "");

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
    app.get("/investments", secureRouteMiddleware, async (req, res) => {
        try {
            const { user } = req;
            const [rows] = await conn.query(`SELECT * FROM investments WHERE user_id = '${user.id}' ORDER BY date DESC`);
            const rendaFixa = rows.filter((row) => row.type == 'RENDA_FIXA');
            const rendaVariavel = rows.filter((row) => row.type == 'RENDA_VARIAVEL');
            res.json({
                rendaFixa,
                rendaVariavel
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });

    // List an user's investments overview
    app.get("/investments/overview", secureRouteMiddleware, async (req, res) => {
        try {
            const { user } = req;
            const [rows] = await conn.query(`SELECT * FROM investments WHERE user_id = '${user.id}'`);

            let total = 0;
            let totalFixa = 0;
            let totalVariavel = 0;

            // Return the total amount of investments
            rows.forEach((investment) => {
                total = mathjs.add(total, investment.value);
                investment.type == 'RENDA_FIXA' ? 
                    totalFixa = mathjs.add(totalFixa, investment.value) : 
                    totalVariavel = mathjs.add(totalVariavel, investment.value);
            });

            // Calculate investments percentage
            let percentageFixa = total > 0 ? mathjs.divide(totalFixa, total) : 0;
            let percentageVariavel = total > 0 ? mathjs.divide(totalVariavel, total) : 0;

            percentageFixa = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(percentageFixa * 100);

            percentageVariavel = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(percentageVariavel * 100);

            res.json({
                total,
                rendaFixa: {
                    total: totalFixa,
                    percentage: percentageFixa
                },
                rendaVariavel: {
                    total: totalVariavel,
                    percentage: percentageVariavel
                }
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });

    // Insert an user's investment
    app.post("/investments", secureRouteMiddleware, async (req, res) => {
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
    app.delete("/investments/:id", secureRouteMiddleware, async (req, res) => {
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
        const connection = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'gorila',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log(`Server is up at port ${SERVER_PORT}`);
        loadRoutes(connection);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});