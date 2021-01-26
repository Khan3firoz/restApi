const express = require("express");
const router = express.Router();


router.get("/comments", (req, res) => {
    res.json({ msg: " hello from the comments" });
});

module.exports = router;