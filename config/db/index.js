const mongoose = require("mongoose");
require('dotenv').config();
async function connect() {
  try {
    await mongoose.connect(process.env.db);
    console.log("ket noi thanh cong ");
  } catch (error) {
    console.log("ket noi thất bại ");
    console.log(error);
  }
}
module.exports = { connect };
