const express = require('express');
const client = require('../db');
const router = express.Router();

// get all entries
router.get('/tools', async(req, res) => {
    const getAllTools = `SELECT * FROM tools; `;

    try {
        const result = await client.query(getAllTools);
        console.log(result);
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack);
    }
});

// post one tool
router.post('/tools', async(req, res) => {
    let kategorie = (req.body.kategorie) ? req.body.kategorie : null;
    let artikel = (req.body.artikel) ? req. body.artikel : null;
    let details = (req.body.details) ? req.body.details : null;
    let status = (req.body.status);

    const postOneTool = `INSERT INTO tools(kategorie, artikel, details, status) VALUES ($1, $2, $3, $4) RETURNING * ;`;

    try {
        const result = await client.query(postOneTool, [kategorie, artikel, details, status]);
        console.log(res);
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err.stack);
    }
});

// get one entry via id
router.get('/tools/:id', async(req, res) => {
    const getOneToolId = `SELECT * FROM tools WHERE id = $1;`;

    try {
        const id = req.params.id;
        const result = await client.query(getOneToolId, [id]);
        console.log(result);
        if (result.rowCount == 1) {
            res.send(result.rows[0]);
        } else {
            res.send({ message: "No tool found with id=" + id });
        }
    } catch (err) {
        console.log("error", err.stack);
    }
});

// get one entry via artikel
router.get('/tools/artikel/:artikel', async(req, res) => {
    const getOneToolArtikel = `SELECT * FROM tools WHERE artikel=$1;`;

    try {
        const artikel = req.params.artikel;
        const result = await client.query(getOneToolArtikel, [artikel]);
        console.log(result);
        if (result.rowCount == 1) {
            res.send(result.rows[0]);
        } else {
            res.send({ message: "No artikel found with artikel=" + artikel});
        }
    } catch  {
        console.log("error", err.stack);
    }
})

//update one entry
router.put('/tools/:id', async(req, res) => {
    const updateOneTool = `SELECT * FROM tools WHERE id=$1;`;

    let id = req.params.id;
    const result = await client.query(updateOneTool, [id]);
    if (result.rowCount > 0) {
        let tool = result.rows[0];
        let kategorie = (req.body.kategorie) ? req.body.kategorie : tool.kategorie;
        let artikel = (req.body.artikel) ? req.body.artikel : tool.artikel;
        let details = (req.body.details) ? req.body.details : tool.details;
        let status = (req.body.status);

        const updatequery = `UPDATE tools SET
            kategorie = $1,
            artikel = $2,
            details = $3,
            status = $4
            WHERE id=$5;`;
        const updateresult = await client.query(updatequery, [kategorie, artikel, details, status, id]);
        console.log(updateresult);
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
    const deleteOneTool = `DELETE FROM tools WHERE id=$1;`;

    try {
        const id = req.params.id;
        const result = await client.query(deleteOneTool, [id]);
        console.log(result);
        if (result.rowCount == 1) {
            res.send({ message: "Tool with id=" + id + " deleted" });
        } else {
            res.send({ message: "No tool found with id=" + id });
        }
    } catch (err) {
        console.log(err.stack);
    }
});

module.exports = router;