const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    position: {
        type: String,
        required: true,
    },
    minutes_played: {
        type: Number,
        required: true,
    },
    goals_scored: {
        type: Number,
        required: function() {return this.position !== "Goalkeeper"},
    },
    assists: {
        type: Number,
        required: function() {return this.position !== "Goalkeeper"},
    },
    yellow_card: {
        type: Boolean,
        required: true,
    },
    red_card: {
        type: Boolean,
        required: true,
    },
    total_shots: {
        type: Number,
        required: function() {return this.position !== "Goalkeeper"},
    },
    shots_on_target: {
        type: Number,
        required: function() {return this.position !== "Goalkeeper"},
    },
    total_passes: {
        type: Number,
        required: true,
    },
    passes_completed: {
        type: Number,
        required: true,
    },
    total_dribbles: {
        type: Number,
        required: function() {return this.position !== "Goalkeeper"},
    },
    dribbles_completed: {
        type: Number,
        required: function() {return this.position !== "Goalkeeper"},
    },
    total_tackles: {
        type: Number,
        required: function() {return this.position !== "Goalkeeper"},
    },
    tackles_completed: {
        type: Number,
        required: function() {return this.position !== "Goalkeeper"},
    },
    saves: {
        type: Number,
        required: function() {return this.position === "Goalkeeper"},
    },
    goals_conceded: {
        type: Number,
        required: function() {return this.position === "Goalkeeper"},
    },
    date: {
        type: Date,
        default: Date.now,
    },
    overall: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model('Match', MatchSchema);