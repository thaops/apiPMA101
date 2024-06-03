const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;


const ProductSchema = new Schema({
    carName: { type: String, required: true },
    img: { type: String, required: true },
    rentalPrice: { type: Number, required: true },
    title: { type: String },
    saleOffL: {type:Number, min:0, max:100},
    categoryId: {
        type: ObjectId,
        ref: "Categories",
      },
      parentId: {
        type: ObjectId,
        ref: "Categories",
      },
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;