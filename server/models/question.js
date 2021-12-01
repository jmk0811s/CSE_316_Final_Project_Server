var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['Text', 'Number', 'Boolean', 'MultipleChoice'],
            default: 'Text',
            required: true,
        },
        header: {type: String, required: true},
        answer: {
            text: {type: String},
            number: {type: Number},
            boolean: {type: Boolean},
            multiple_choice: {type : Array, "default" : []}
        },
        daylog: {type: Schema.Types.ObjectID, ref: "Daylog", required: true}
    }
);

module.exports = mongoose.model('Question', QuestionSchema);