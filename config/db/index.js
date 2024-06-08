const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect('mongodb://103.72.96.121:29204/PMA101');
        console.log("ket noi thanh cong ")
    } catch (error) {
        console.log("ket noi thất bại ")
    }
   
}
module.exports = {connect}


