const express = require('express');
const client = require('./db');
const router = express.Router();

// test
// router.get('/test', async(req, res) => {
//    res.send({ message: "Test mit PostgreSQL" });
// })

// get all entries
router.get('/tools', async(req, res) => {
    const query = `SELECT * FROM tools `;

    try {
        const result = await client.query(query)
        console.log(result)
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack)
    }
});

// post one tool
router.post('/tools', async(req, res) => {
    let kategorie = (req.body.kategorie) ? req.body.kategorie : null;
    let ausleihen = (req.body.ausleihen) ? req. body.ausleihen : null;
    let art = (req.body.art) ? req.body.art : null;
    let status = (req.body.status) ? req.body.status : null;

    const query = `INSERT INTO tools(kategorie, ausleihen, art, status) VALUES ($1, $2, $3, $4) RETURNING *; `

    try {
        const result = await client.query(query, [kategorie, ausleihen, art, status])
        console.log(res)
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err.stack)
    }
});

// get one entry via id
router.get('/tools/:id', async(req, res) => {
    const query = `SELECT * FROM tools WHERE id = $1`;

    try {
        const id = req.params.id;
        const result = await client.query(query, [id])
        console.log(result)
        if (result.rowCount == 1) {
            res.send(result.rows[0]);
        } else {
            res.send({ message: "No tool found with id=" + id });
        }
    } catch (err) {
        console.log("error", err.stack)
    }
});

module.exports = router;