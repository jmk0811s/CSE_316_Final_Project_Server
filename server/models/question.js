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
        choices: {type: Array, default: []},
        mdate: {type: Date, required: true},
        nanoid: {type: String, required: true},
        creator: {type: Schema.Types.ObjectID, ref: "User"}
    }
);

module.exports = mongoose.model('Question', QuestionSchema);