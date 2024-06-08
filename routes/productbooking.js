const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const ProductBooking = require('../models/ProductBooking');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/add', function(req, res){
  const { userId, carName, rentalPrice,img,title,saleOffL } = req.body;

  ProductBooking.findOne({ userId: userId, carName: carName,img:img,title:title,saleOffL:saleOffL })
      .then(existingProduct => {{
              const newProductInCart = new ProductBooking({
                  userId: userId,
                  carName: carName,
                  rentalPrice: rentalPrice,
                  img:img,
                  title:title,
                  saleOffL:saleOffL,
              });
              return newProductInCart.save();
          }
      })
      .then(savedProductInCart => {
          const statusCode = savedProductInCart ? 200 : 201;
          res.status(statusCode).json(savedProductInCart);
      })
      .catch(error => {
          res.status(400).json({ message: error.message });
      });
});

router.get('/search/:userId', function(req,res){
  const userId = req.params.userId;

  ProductBooking.find({ userId: userId })
      .then(data =>{
          res.json(data);
      })
      .catch(err=>{
          res.status(400).json({ message: err.message });
      });
});
module.exports = router;
