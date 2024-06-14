var express = require('express');
var router = express.Router();
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

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

router.post("/register", async function (req, res, next) {
  try {
    let data = req.body;
    // console.log(data);

    if (!data.name || !data.email || !data.password) {
      res.status(200).json({ error: "vui lòng nhập đầy đủ dữ liệu" });
    } else {
      if (data.password.length < 8 || data.password > 255) {
        res.status(200).json({ error: "Mật khẩu phải có ít nhất 8 ký tự và ít hơn 255 ký tự" });
        return;
      }
      const newUser = await UserControler.register(
        data.email,
        data.password,
        data.name,
        data.phone
      );
      res.status(200).json(newUser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi hệ thống " + err });
  }
});

router.post('/changePassword', async function (req, res, next) {
  const { email, password, newPassword } = req.body;
  let changePass = await UserControler.changePassword(email, password, newPassword);
  res.json(changePass);
});

router.post('/forgotPassword', async (req, res) => {
  const { email } = req.body;
  const user = await UserControler.getUserByEmail(email);
  if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy email' });
  }

  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  const otpDocument = new OTP({
      email: email,
      otp: otp,
      timestamp: Date.now() + 600000 // Thời hạn của OTP là 10 phút
  });

  try {
      await sendOTP(email, otp);
      await OTP.deleteOne({ email: email });
      await otpDocument.save();
      res.status(200).json({ message: 'Đã gửi OTP thành công' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gửi OTP thất bại' });
  }
});

router.post('/resetPassword', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await UserControler.getUserByEmail(email);
  if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy Email' });
  }

  const otpRecord = await OTP.findOne({ email: email });
  if (!otpRecord || otpRecord.otp !== otp || otpRecord.timestamp < Date.now()) {
      return res.status(400).json({ error: 'OTP không hợp lệ hoặc đã hết hạn' });
  }

  const result = await UserControler.resetPassword(email, newPassword);
  if (result.success) {
      await OTP.deleteOne({ email: email });
      res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });

  } else {
      res.status(500).json({ error: 'Đặt lại mật khẩu thất bại' });
  }
});

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'phamngocquockhanh2004@gmail.com',
          pass: 'bjjnqvppmoxvqlei'
      }
  });

  const mailOptions = {
    from: 'phamngocquockhanh2004@gmail.com',
    to: email,
    subject: 'Reset Password OTP',
    html: `
        <h2>Mã OTP của bạn là: <strong>${otp}</strong></h2>
        <h2>Mã có hiệu lực trong 10 phút.</h2>
    `
};

  return await transporter.sendMail(mailOptions);
}

module.exports = router;
