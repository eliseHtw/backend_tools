const express = require('express');
const router = express.Router();

// test
router.get('/test', async(req, res) => {
    res.send({ message: "jetzt mit PostgreSQL" });
})

module.exports = router;