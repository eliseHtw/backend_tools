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
    let artikel = (req.body.artikel) ? req. body.artikel : null;
    let details = (req.body.details) ? req.body.details : null;
    let status = (req.body.status);

    const query = `INSERT INTO tools(kategorie, artikel, details, status) VALUES ($1, $2, $3, $4) RETURNING *; `

    try {
        const result = await client.query(query, [kategorie, artikel, details, status])
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

//update one entry
router.put('/tools/:id', async(req, res) => {
    const query = `SELECT * FROM tools WHERE id=$1`;

    let id = req.params.id;
    const result = await client.query(query, [id])
    if (result.rowCount > 0) {
        let tool = result.rows[0];
        let kategorie = (req.body.kategorie) ? req.body.kategorie : tool.kategorie;
        let artikel = (req.body.artikel) ? req.body.artikel : tool.artikel;
        let details = (req.body.details) ? req.body.details : tool.details;
        let status = (req.body.status);

        const updatequery = `UPDATE tools Set
            kategorie = $1,
            artikel = $2,
            details = $3,
            status = $4
            WHERE id=$5;`;
        const updateresult = await client.query(updatequery, [kategorie, artikel, details, status, id]);
        console.log(updateresult)
        res.send({ id, kategorie, artikel, details, status });
    } else {
        res.status(404)
        res.send({
            error: "Tools with id=" + id + " does not exist!"
        })
    }
});

// delete one entry via id
router.delete('/tools/:id', async(req, res) => {
    const query = `DELETE FROM tools WHERE id=$1`;

    try {
        const id = req.params.id;
        const result = await client.query(query, [id])
        console.log(result)
        if (result.rowCount == 1) {
            res.send({ message: "Tool with id=" + id + " deleted" });
        } else {
            res.send({ message: "No tool found with id=" + id });
        }
    } catch (err) {
        console.log(err.stack)
    }
});

module.exports = router;