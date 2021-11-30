var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DaylogSchema = new Schema(
    {
        date: {type: Date, required: true},
        creator: {type: Schema.Types.ObjectID, ref: "User", required: true}
    }
);

module.exports = mongoose.model('Daylog', DaylogSchema);