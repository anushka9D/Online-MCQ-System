const express = require('express');
const router = express.Router();
const {getAllExams, getQuestionsByExamId, createExam, createQuestions} = require('../controller/examController');

// Routes
router.post('/', createExam);
router.post('/questions', createQuestions);
router.get('/', getAllExams);
router.get('/:examId', getQuestionsByExamId);

module.exports = router;