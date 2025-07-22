const express = require("express");
const router = express.Router();
const {Login} = require("../controller/userController");

router.get("/login" ,Login);

module.exports = router;