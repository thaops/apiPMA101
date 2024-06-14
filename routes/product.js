const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Product = require("../models/Product");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/add", function (req, res, next) {
  const productData = req.body;
  const product = new Product(productData);
  product
    .save()
    .then((data) => {
      res.json({ msg: "Thêm sản phẩm thành công" });
    })
    .catch((err) => {
      console.error("Lỗi khi thêm sản phẩm:", err);
      res.status(500).json({ msg: "Thêm sản phẩm thất bại" });
    });
});

router.get("/fromId/:_id?", async function (req, res, next) {
  const id = req.params._id;
  if (id) {
    const require = await Product.findById(id);
    if (require) {
      res.json(require);
    } else {
      res.status(400).json({ message: "Không tìm thấy sản phẩm" });
    }
  } else {
    res.status(400).json({ message: "Không tìm thấy sản phẩm" });
  }
});

// category
router.get("/mucProduct/:_id?", function (req, res) {
  const id = req.params._id;
  let query = {};
  if (id) {
    query = {
      $or: [{ categoryId: id }, { parentId: id }],
    };
  }
  Product.find(query)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});
//all product
router.get("/get/product", function (req, res) {
  Product.find()
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.status(500).json({ msg: "that bai " });
    });
});

//tim
router.post("/search", function (req, res) {
  const carName = req.body.carName;

  if (carName) {
    Product.find({ carName: { $regex: carName, $options: "i" } })
      .then((products) => {
        res.json(products);
      })
      .catch((err) => {
        res.status(500).json({ msg: "Thất bại trong việc tìm kiếm theo ten." });
      });
  } else {
    res
      .status(400)
      .json({ msg: "Ten không được tìm thấy trong dữ liệu yêu cầu." });
  }
});
module.exports = router;
