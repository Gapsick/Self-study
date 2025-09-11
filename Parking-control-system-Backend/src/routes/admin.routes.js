const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/", (req, res) => {
    pool.query('SELECT * FROM cars', (err, results) => {
        if (err) {
            console.error("DB error:", err)
            return res.status(500).json({ erorr: "DB error"})
        }
        console.log('Cars info is: ', results);
        res.send(results)
    });
});

router.get("/:id", (req, res) => {
    const car_id = req.params.id

    pool.query('SELECT * FROM parking_sessions WHERE id = ?', [car_id], (err, results) => {
        if (err) {
            console.log("DB Error", err)
            return res.status(500).json({ error: "DB error"})
        }
        console.log("Car info: ", results[0]);
        res.send(results[0])
    });
});

module.exports = router;