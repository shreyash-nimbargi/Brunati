const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({

    freeSampleEnabled: {
        type: Boolean,
        default: false
    },

    allowedSamples: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sample"
    }],

    maxSamples: {
        type: Number,
        default: 1
    }

});

module.exports = mongoose.model("Settings", settingsSchema);