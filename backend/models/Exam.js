const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({

    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    }

});

module.exports = mongoose.model('Exam', examSchema);
