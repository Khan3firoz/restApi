const express = require("express");
const router = express.Router();


router.get("/post", (req, res) => {
    res.json({ msg: " hello from the post" });
});

module.exports = router;