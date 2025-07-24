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