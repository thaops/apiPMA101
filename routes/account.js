const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const AccountModel = require('../models/Accounts');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', (req, res, next) => {
    const { name, email, pass } = req.body;

    AccountModel.findOne({
        email:email
    })
    .then(data=>{
        if(data){
            res.json('tai khoảng đã tồn tại')
        }else{
            AccountModel.create({ name, email, pass })
            .then(data => {
                res.status(201).json({ message: 'Tạo tài khoản thành công', data });
            })
        }
    })

        .catch(err => {
            console.error('Lỗi khi tạo tài khoản:', err);
            res.status(500).json({ message: 'Tạo tài khoản thất bại', error: err.message });
        });
});

router.post('/login', (req,res,next)=>{
    const {name,pass} = req.body;
    AccountModel.findOne({
        name:name,
        pass:pass
    })
    .then(data=>{
        if(data){
            res.json({code:1, msg:'đang nhập thanh công'})
        }else{
            res.status(300).json({code:2, mgs:'tài khoảng sai'})
        }
    })
    .catch(err=>{
        res.status(500).json({msg:'có lỗi bên sever'})
    })
})

module.exports = router;
