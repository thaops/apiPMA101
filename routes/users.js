var express = require('express');
var router = express.Router();

const UserControler = require('../models/Users/UserController');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', async function (req, res, next) {
  const username = req.query.email;
  const password = req.query.password;

  let loginUser = await UserControler.login(username, password);

  if (loginUser) {
    res.json(loginUser);
  } else {
    res.json({ error: "Tài khoản hoặc mật khẩu sai" })
  }

});

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  let loginUser = await UserControler.login(email, password);
  if (loginUser) {
    res.json(loginUser);
  } else {
    res.json({ error: "Tài khoản hoặc mật khẩu sai" })
  }

});

router.post('/register', async function (req, res, next) {
  try {
    let data = req.body;
    // console.log(data);

    if (!data.name || !data.email || !data.password) {
      res.status(200).json({ error: 'vui lòng nhập đầy đủ dữ liệu' });
    } else {
      const newUser = await UserControler.register(data.email, data.password, data.name, data.phone)
      res.status(200).json(newUser);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi hệ thống ' + err });
  }
});


router.post('/changePassword', async function (req, res, next) {
  const { email, password, newPassword } = req.body;
  let changePass = await UserControler.changePassword(email, password, newPassword);
  res.json(changePass);
});


module.exports = router;
