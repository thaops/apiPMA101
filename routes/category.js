const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Category = require('../models/Category');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/addCategory', function(req, res, next) {
    const { name, img } = req.body;
    if (!name) {
        return res.status(400).json({ msg: 'Vui lòng cung cấp tên danh mục' });
    }

    Category.findOne({ name: name })
        .then(existingCategory => {
            if (existingCategory) {
                
                return res.status(400).json({ msg: 'Tên danh mục đã tồn tại' });
            } else {
                Category.create({ name: name, img: img }) 
                    .then(newCategory => {
                        res.status(201).json({ msg: 'Thêm danh mục thành công', category: newCategory });
                    })
                    .catch(err => handleError(err, res));
            }
        })
        .catch(err => handleError(err, res));
});

router.get('/get', function(req,res){
    Category.find()
    .then(categories => {
        res.json(categories)
    })
    .catch(err=>{
        res.status(500).json('that bai')
    })
});


module.exports = router;
