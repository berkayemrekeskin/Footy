const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    foot: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    overall: {
        type: Number,
        required: false,
        default: 0,
    },
    pace: {
        type: Number,
        required: false,
        default: 0,
    },
    shooting: {
        type: Number,
        required: false,
        default: 0,
    },
    passing: {
        type: Number,
        required: false,
        default: 0,
    },
    dribbling: {
        type: Number,
        required: false,
        default: 0,
    },
    defending: {
        type: Number,
        required: false,
        default: 0,
    },
    physical: {
        type: Number,
        required: false,
        default: 0,
    },
    goalkeeping: {
        type: Number,
        required: false,
        default: 0,
    },
})

module.exports = mongoose.model('Info', UserInfoSchema);