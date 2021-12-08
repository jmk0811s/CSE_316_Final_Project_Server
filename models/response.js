var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResponseSchema = new Schema(
    {
        response: {
            text: {type: String},
            number: {type: Number},
            boolean: {type: Boolean},
            multiple_choice: {type : Array, "default" : []}
        },
        date: {type: Date, required: true},
        nanoid: {type: String, required: true},
        question: {type: Schema.Types.ObjectID, ref: "Question"},
        creator: {type: Schema.Types.ObjectID, ref: "User"}
    }
);

module.exports = mongoose.model('Response', ResponseSchema);