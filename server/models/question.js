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
        answer: {type: String, required: true},
        daylog: {type: Schema.Types.ObjectID, ref: "Daylog", required: true}
    }
);

module.exports = mongoose.model('Question', QuestionSchema);


/*

/daylog             All daylogs, each daylog have group of questions
/daylog/{date}      The daylog at certain date
/questions          All questions
/questions/{date}   Questions created on certain date
/questions/{type}   Questions of certain type


 */