const express = require('express');
const router = express.Router();
const {createResult} = require('../controller/resultController');

router.post('/', createResult);

module.exports = router;