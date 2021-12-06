var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FormSchema = new Schema(
    {
        creator: {type: Schema.Types.ObjectID, ref: "User"},
    }
);

module.exports = mongoose.model('Form', FormSchema);