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
        header: {type: String, default: ''},
        answer: {
            text: {type: String},
            number: {type: Number},
            boolean: {type: Boolean},
            multiple_choice: {type : Array, "default" : []}
        },
        mdate: {type: Date, required: true},
        nanoid: {type: String, required: true},
        creator: {type: Schema.Types.ObjectID, ref: "User"},
        form: {type: Schema.Types.ObjectID, ref: "Form"},
        daylog: {type: Schema.Types.ObjectID, ref: "Daylog"}
    }
);

module.exports = mongoose.model('Question', QuestionSchema);