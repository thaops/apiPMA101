const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
});

const AccountModel = mongoose.model('Account', AccountSchema);

module.exports = AccountModel;
