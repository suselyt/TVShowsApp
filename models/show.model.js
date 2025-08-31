const mongoose = require('mongoose');

const showSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter a name"],
            trim: true
        },

        seasons: {
            type: Number,
            required: [true, "Enter number of seasons"],
            min: 1
        },

        streaming: {
            type: [String]
        },

        running: {
            type: Boolean
        },

        awards: {
            type: {
                name : [{
                    category: {
                        type: String
                    },
                    year: {
                        type: Number
                    }
                }]
            }
        },
    },
    {
        timestamps: true
    }
);

const show = mongoose.model("show", showSchema);
module.exports = show;