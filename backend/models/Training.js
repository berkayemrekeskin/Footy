const mongoose = require("mongoose");

const TrainingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type: {
        type: String,
        required: true,
    },
    effect: {
        type: String,
        required: true,
    },
    effect_value: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Training', TrainingSchema);