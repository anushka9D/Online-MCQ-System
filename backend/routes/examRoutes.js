const express = require('express');
const router = express.Router();
const {getAllExams, getQuestionsByExamId, createExam, createQuestions, deleteExamWithQuestions} = require('../controller/examController');

// Routes
router.post('/', createExam);
router.post('/questions', createQuestions);
router.get('/', getAllExams);
router.get('/:examId', getQuestionsByExamId);
router.delete('/:examId', deleteExamWithQuestions);

module.exports = router;