const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect('mongodb+srv://nguyenpham0666:7eW8rlCQvod1YTRS@pma101.efiuq1h.mongodb.net/PMA101');
        console.log("ket noi thanh cong ")
    } catch (error) {
        console.log("ket noi thất bại ")
    }
   
}
module.exports = {connect}


