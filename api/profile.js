const express = require("express");
const router = express.Router();


router.get("/profile", (req, res) => {

    res.json({ msg: " hello from the profile" });
});

module.exports = router;