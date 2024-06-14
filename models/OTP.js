const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    timestamp: Number
});

module.exports = mongoose.model('OTP', otpSchema);