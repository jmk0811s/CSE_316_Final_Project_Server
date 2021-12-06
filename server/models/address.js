var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AddressSchema = new Schema(
    {
        address1: {type: String},
        address2: {type: String}
    }
);

module.exports = mongoose.model('Address', AddressSchema);