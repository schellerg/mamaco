const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");

const SERVER_PORT = 7777;

const app = express();
app.use(bodyParser.json());

// Rotas
const loadRoutes = (conn) => {
    app.get("/investment", async (request, response) => {
        try {
            const [rows] = await conn.query("SELECT * FROM investments");
            response.json(rows);
        } catch (error) {
            response.status(500).json({
                message: error.message,
            });
        }
    });

    app.post("/investment", async (request, response) => {
        try {
            const {type, value, date} = request.body;
            const [rows] = await conn.query(`INSERT INTO investments (type, value, date) VALUES ('${type}', '${value}', '${date}')`);
            response.json(rows);
        } catch (error) {
            response.status(500).json({
                message: error.message,
            });
        }
    });

    app.delete("/investment/:id", async (request, response) => {
        try {
            const { id } = request.params;
            const [rows] = await conn.query(`DELETE FROM investments WHERE id = ${id}`);
            response.json(rows);
        } catch (error) {
            response.status(500).json({
                message: error.message,
            });
        }
    });
}

app.listen(SERVER_PORT, async () => {
    try {
        // Banco de dados
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