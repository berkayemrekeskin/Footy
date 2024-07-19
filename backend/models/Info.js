const mongoose = require("mongoose");

const InfoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    age : {
        type: Number,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    goals: {
        type: Number,
        required: function() { return this.position !== "Goalkeeper"},
    },
    assists: {
        type: Number,
        required: function() { return this.position !== "Goalkeeper"},
    },
    saves: {
        type: Number,
        required: function() { return this.position === "Goalkeeper"},
    },
    goals_conceded: {
        type: Number,
        required: function() { return this.position === "Goalkeeper"},
    },
    dribbles_tried: {
        type: Number,
        required: function() { return this.position !== "Goalkeeper"},
    },
    dribbles_complete: {
        type: Number,
        required: function() { return this.position !== "Goalkeeper"},
    },
    passes_tried: {
        type: Number,
        required: true,
    },
    passes_complete: {
        type: Number,
        required: true,
    },
    shots_tried: {
        type: Number,
        required: function() { return this.position !== "Goalkeeper"},
    },
    shots_complete: {
        type: Number,
        required: function() { return this.position !== "Goalkeeper"},
    },
    
    
})

module.exports = mongoose.model('Info', InfoSchema);