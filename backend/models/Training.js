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
    duration: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },

})

module.exports = mongoose.model('Training', TrainingSchema);