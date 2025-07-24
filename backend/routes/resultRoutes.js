const express = require('express');
const router = express.Router();
const {createResult, getResultById, getResultsByUserId, getResultCountByUserId} = require('../controller/resultController');

router.post('/', createResult);
router.get('/:result_id', getResultById);
router.get('/user/:user_id', getResultsByUserId);
router.get('/count/:user_id', getResultCountByUserId);

module.exports = router;