const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    exam_id: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Exam', 
        required: true 
    },
    question_text: { 
        type: String, 
        required: true 
    },
    options: [{ 
        type: String, 
        required: true 
    }],
    correct_option: { 
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('Question', questionSchema);