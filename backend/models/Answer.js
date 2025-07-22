const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({

    result_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Result', 
        required: true 
    },
    question_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question', 
        required: true 
    },
    selected_option: { 
        type: String, 
        required: true 
    },
    is_correct: { 
        type: Boolean, 
        required: true 
    }
});

module.exports = mongoose.model('Answer', answerSchema);
