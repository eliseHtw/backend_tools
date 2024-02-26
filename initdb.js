const express = require('express');
const client = require('./db');
const initdb = express.Router();
const format = require('pg-format');

initdb.get('/', async(req, res) => {

    //Anlegen der Tabelle tools
    let query = `
            DROP TABLE IF EXISTS tools;
            CREATE TABLE tools(id serial PRIMARY KEY, kategorie VARCHAR(50), ausleihen VARCHAR(50), art VARCHAR(100), status BOOLEAN)
            `;

    try {
        await client.query(query)
        console.log("Table created successfully ...")
    } catch (err) {
        console.log(err)
    }

    // Befüllen der Tabelle tools mit 10 Einträgen
    const values = [
        ["Kleinkram", "Straßenmalkreide", "Paket á ca. 20 Stück", true],
        ["Technik", "Soundsystem groß", "Mischpult, 2 große Boxen, Kabel / Anschluss", true],
        ["Technik", "Soundsystem klein", "Box mit Rollen und Teleskopgriff, Kabel / Anschluss / Bluetooth", true],
        ["Technik", "Bühne", "6 Teile á 1*2m", false],
        ["Transport", "Bollerwagen, z.B. für Getränke", "50*80 cm, 30 cm hoch, plus Rollen und Griff", true],
        ["Übernachtung", "Set Schlafsack und Isomatte", "jeweils als Rolle verpackt", true],
        ["Übernachtung", "Set Zelt, Schlafsack und Isomatte", "jeweils als Rolle verpackt", true],
        ["Versorgung", "Kanister und Becher für Getränke (auch heiß)", "2 große Kanister á 10l, 60 Pfandbecher", true],
        ["Kommunikation", "Telefone", "20 Handys (nicht smart)", true],
        ["Bastelkram", "Raspberry Pis", "10 Stück", true]
    ];

    const paramquery = format('INSERT INTO tools(kategorie, ausleihen, art, status) VALUES %L RETURNING *', values);

    try {
        const result = await client.query(paramquery)
        console.log("10 entries inserted ...")
        res.status(200)
        res.send(result.rows)
    } catch (err) {
        console.log(err)
    }
});

module.exports = initdb;