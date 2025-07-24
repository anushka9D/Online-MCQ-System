const Result = require('../models/Result');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

exports.createResult = async (req, res) => {
  try {
    const { user_id, exam_id, useranswers, timestamp } = req.body;
    
    let score = 0;
    const answersToSave = [];

    const questions = await Question.find({ exam_id });

    for (let question of questions) {
      const selected_option = useranswers[question._id];

      if (!selected_option) continue;

      const is_correct = selected_option === question.correct_option;

      if (is_correct) score++;


      answersToSave.push({
        question_id: question._id,
        selected_option,
        is_correct
      });
    }

    const result = new Result({
      user_id,
      exam_id,
      score,
      timestamp
    });
    await result.save();

    // Save answers with result_id
    const answerDocs = answersToSave.map(ans => ({
      ...ans,
      result_id: result._id
    }));
    await Answer.insertMany(answerDocs);

    res.status(201).json({ result_id: result._id });

  } catch (error) {
    console.error('Error submitting result:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getResultById = async (req, res) => {
  try {
    const { result_id } = req.params;

    // 1. Find the result and populate user & exam
    const result = await Result.findById(result_id)
      .populate('user_id', 'name') // get user name
      .populate('exam_id', 'title'); // get exam title

    if (!result) {
      return res.status(404).json({ message: 'Result not found', result_id });
    }

    // 2. Get all answers linked to this result
    const answers = await Answer.find({ result_id });

    // 3. Get all questions for this exam
    const questions = await Question.find({ exam_id: result.exam_id._id });

    // Create a map of questions
    const questionMap = {};
    questions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });

    // 4. Build detailed answer feedback
    const detailedAnswers = answers.map(answer => {
      const question = questionMap[answer.question_id.toString()];
      if (!question) {
        return {
          question_text: 'Question not found',
          options: [],
          selected_option: answer.selected_option,
          correct_option: null,
          is_correct: false
        };
      }

      return {
        question_text: question.question_text,
        options: question.options,
        selected_option: answer.selected_option,
        correct_option: question.correct_option,
        is_correct: answer.is_correct
      };
    });

    // 5. Calculate score metrics
    const totalQuestions = questions.length;
    const score = result.score;
    const incorrectAnswers = totalQuestions - score;
    const percentage = (score / totalQuestions) * 100;

    let grade;
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else grade = 'F';

    // 6. Return enriched result data
    res.status(200).json({
      result_id: result._id,
      user: {
        id: result.user_id._id,
        name: result.user_id.name
      },
      exam: {
        id: result.exam_id._id,
        title: result.exam_id.title
      },
      score,
      totalQuestions,
      correctAnswers: score,
      incorrectAnswers,
      percentage: percentage.toFixed(2),
      grade,
      timestamp: result.timestamp,
      answers: detailedAnswers
    });

  } catch (error) {
    console.error('Error getting result by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};