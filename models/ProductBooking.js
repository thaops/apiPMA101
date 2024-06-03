const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;


const ProductBookingSchema = new Schema({

  userId: {
    type: ObjectId, 
    ref: 'User' 
},
    carName: { type: String, required: true },
    img: { type: String, required: true },
    rentalPrice: { type: Number, required: true },
    title: { type: String },
    saleOffL: {type:Number, min:0, max:100},

});

const ProductModel = mongoose.model('ProductBooking', ProductBookingSchema);

module.exports = ProductModel;