const express = require('express');
const router = express.Router();
const client = require('../db');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Anlegen der Tabelle users
router.get('/initUsers', async(req, res) => {
    let usersTable = `
        DROP TABLE IF EXISTS users;
        CREATE TABLE users(id serial PRIMARY KEY, username VARCHAR(255), 
        password VARCHAR(255), email VARCHAR(255), role VARCHAR(255));
        `;

    try {
        await client.query(usersTable);
        console.log(`Table users in database ${process.env.PGDATABASE} created successfully ...`);
    } catch(err) {
        console.log(err);
    }
});

// login user
router.post('/login', async(req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let check = await client.query('SELECT * FROM users WHERE username = $1', [username])
    if (check.rowCount > 0) {
        let user = check.rows[0];
        let loginOk = await bcrypt.compare(password, user.password);
        if (loginOk) {
            res.status(200);
            res.send({ message: `user ${username} logged in` });
        } else {
            res.status(401)
            res.send({ message: 'username or password wrong' });
        }
    } else {
        res.send({ message: 'username or password wrong' });
    }
});

// create new user
router.post('/', async(req, res) => {
    let username = (req.body.username) ? req.body.username : null;
    let password = (req.body.password) ? req.body.password : null;
    let hashPassword = await bcrypt.hash(password, 12);
    // console.log('hash : ', hashPassword);
    let email = (req.body.email) ? req.body.email : null;
    let role = (req.body.role) ? req.body.role : null;

    let checkmail = await client.query(`SELECT * FROM users WHERE email = $1;`, [email]);
    let checkname = await client.query(`SELECT * FROM users WHERE username = $1;`, [username]);
    if (checkmail.rowCount > 0) {
        res.send({ message: `E-Mail ${email} already exists` });
    } else if (checkname.rowCount > 0) {
        res.send({ message: `Name ${username} already exists` });
    } else {
        const anfrage = `INSERT INTO users(username, password, email, role) VALUES($1, $2, $3, $4) RETURNING *;`;
        try {
            const result = await client.query(anfrage, [username, hashPassword, email, role]);
            console.log('result', result.rows[0]);
            res.send(result.rows[0]);
        } catch (err) {
            console.log(err.stack);
        }
    }
});

// get all users
router.get('/', async(req, res) => {
    const anfrage = `SELECT * FROM users;`;

    try {
        const result = await client.query(anfrage);
        console.log(res);
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack);
    }
});

// get one user via id
router.get('/id/:id', async(req, res) => {
    const query = `SELECT * FROM users WHERE id=$1;`;

    try {
        const id = req.params.id;
        const result = await client.query(query, [id]);
        console.log(result);
        if (result.rowCount == 1) {
            res.send(result.rows[0]);
        } else {
            res.send({ message: "No user found with id=" + id });
        }
    } catch (err) {
        console.log("error", err.stack);
    }
});

// get user by name
router.get('/:username', async(req, res) => {
    const anfrage = `SELECT * FROM users WHERE username=$1;`;

    try {
        const username = req.params.username;
        const result = await client.query(anfrage, [username]);
        console.log(result);
        if (result.rowCount == 1) {
            res.send(result.rows[0]);
        } else {
            res.status(404);
            res.send({ message: "No user found with username=" + username });
        }
    } catch (err) {
        console.log("error", err.stack);
    }
});

// delete user by id
router.delete('/:id', async(req, res) => {
    const anfrage = `DELETE FROM users WHERE id=$1;`;

    try {
        const id = req.params.id;
        const result = await client.query(anfrage, [id])
        console.log(result)
        if (result.rowCount == 1) {
            res.send({ message : "User with id=" + id + " deleted" });
        } else {
            res.status(404);
            res.send({ message: "No user found with id=" + id});
        }
    } catch (err) {
        console.log(err.stack);
    }
});

// change data of user with id 
// jetzt auch mit abfrage, ob E-Mail-Adresse oder Username schon existiert
router.put('/users/:id', async(req, res) => {
    const anfrage = `SELECT * FROM users WHERE id=$1;`;

    let id = req.params.id;
    const result = await client.query(anfrage, [id]);
    if (result.rowCount > 0) {
        let user = result.rows[0];
        let username = (req.body.username) ? req.body.username : user.username;
        let password = (req.body.password) ? req.body.password : user.password;
        let hashPassword = await bcrypt.hash(password, 12);
        let email = (req.body.email) ? req.body.email : user.email;
        let role = (req.body.role) ? req.body.role : user.role;


        let checkmails = await client.query(`SELECT * FROM usersh WHERE email = $1;`, [email]);
        let checknames = await client.query(`SELECT * FROM usersh WHERE username = $1;`, [username]);
        if (checkmails.rowCount > 1) {
            res.send({ message: `E-Mail ${email} already exists` });
        } else if (checknames.rowCount > 1) {
            res.send({ message: `Name ${username} already exists` });
        } else {
            const updateanfrage = `UPDATE users SET
                username = $1,
                password = $2,
                email = $3,
                role = $4
                WHERE id=$5
                RETURNING *;`;
        
            const updateresult = await client.query(updateanfrage, [username, hashPassword, email, role, id]);
            console.log('updateresult: ', updateresult);
            res.send({ id, username, hashPassword, email, role });
        }
    } else {
        res.status(404);
        res.send({
            error: "User with id=" + id + " does not exist!"
        });
    }
});

module.exports = router;