const express = require('express');
const client = require('./db');
const initdb = express.Router();
const format = require('pg-format');

initdb.get('/', async(req, res) => {

    //Anlegen der Tabelle tools
    let query = `
            DROP TABLEIF EXISTS tools;
            CREATE TABLE tools(id serial PRIMARY KEY, kategorie VARCHAR(50), )`
})