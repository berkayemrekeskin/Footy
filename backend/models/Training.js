const mongoose = require("mongoose");

const TrainingSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Training', TrainingSchema);