const Exam = require('../models/Exam');
const Question = require('../models/Question');

// Create a new exam (admin usage)
exports.createExam = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newExam = new Exam({ title, description });
    await newExam.save();
    res.status(201).json(newExam);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create exam.' });
  }
};

// Create a new Questions (admin usage)
exports.createQuestions = async (req, res) => {
  const questions = req.body;

  if (!Array.isArray(questions)) {
    return res.status(400).json({ error: 'Request body should be an array of questions.' });
  }

  try {
    const insertedQuestions = await Question.insertMany(questions);
    res.status(201).json(insertedQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert questions.' });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exams.' });
  }
};

// Get questions for a specific exam
exports.getQuestionsByExamId = async (req, res) => {
  const { examId } = req.params;
  try {
    const questions = await Question.find({ exam_id: examId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
};
