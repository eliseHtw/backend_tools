const express = require('express');
const client = require('./db');
const initdb = express.Router();
const format = require('pg-format');

initdb.get('/', async(req, res) => {

    // Anlegen der Tabelle tools
    let dbInitHeader = `
            DROP TABLE IF EXISTS tools;
            CREATE TABLE tools(id serial PRIMARY KEY, kategorie VARCHAR(50), artikel VARCHAR(50), details VARCHAR(255), status VARCHAR(255));
            `;

    try {
        await client.query(dbInitHeader);
        console.log(`Table tools in database ${process.env.PGDATABASE} created successfully ...`);
    } catch (err) {
        console.log(err);
    }

    // Befüllen der Tabelle tools mit den ersten Einträgen
    const values = [
        ["Kleinkram", "Straßenmalkreide", "Paket á ca. 20 Stück", "verfügbar"],
        ["Technik", "Soundsystem groß", "Mischpult, 2 große Boxen, Kabel / Anschluss", "nicht verfügbar"],
        ["Technik", "Soundsystem klein", "Box mit Rollen und Teleskopgriff, Kabel / Anschluss / Bluetooth", "verfügbar"],
        ["Technik", "Bühne", "6 Teile á 1*2m", "verfügbar"],
        ["Transport", "Bollerwagen, z.B. für Getränke", "50*80 cm, 30 cm hoch, plus Rollen und Griff", "verfügbar"],
        ["Übernachtung", "Set Schlafsack und Isomatte", "jeweils als Rolle verpackt", "verfügbar"],
        ["Übernachtung", "Set Zelt, Schlafsack und Isomatte", "jeweils als Rolle verpackt", "verfügbar"],
        ["Versorgung", "Kanister und Becher für Getränke (auch heiß)", "2 große Kanister á 10l, 60 Pfandbecher", "verfügbar"],
        ["Kommunikation", "Telefone", "20 Handys (nicht smart)", "verfügbar"],
        ["Bastelkram", "Raspberry Pis", "10 Stück", "verfügbar"]
    ];

    const dbInitContent = format('INSERT INTO tools(kategorie, artikel, details, status) VALUES %L RETURNING *', values);

    try {
        const result = await client.query(dbInitContent);
        console.log(`${result.rowCount} entries inserted ...`);
        res.status(200);
        res.send(result.rows);
    } catch (err) {
        console.log(err);
    }
});

module.exports = initdb;