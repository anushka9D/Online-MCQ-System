const express = require('express');
const router = express.Router();
const {createResult, getResultById} = require('../controller/resultController');

router.post('/', createResult);
router.get('/:result_id', getResultById);

module.exports = router;