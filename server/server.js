const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'form',
    password: 'ash@1530',
    port: 5432,
});


const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

app.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    if (!validateEmail(email)) {
        res.json({ error: "Invalid Email " });
        return;
    }
    try {
        const newForm = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
            [name, email, password]
        );
        console.log(newForm);
        res.json(newForm.rows[0]); // { id: 1 }
    } catch (err) {
        console.error(err.message);
        res.json({ error: err.message });
    }
});

app.get('/', async (req, res) => {
    try {
        const allForms = await pool.query('SELECT name, email, id FROM users');
        res.json(allForms.rows);
    } catch (err) {
        console.error(err.message);
        res.json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
