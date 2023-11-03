const express = require("express");
let router = express.Router();
let conn = require("../connect");
let jwt = require("jsonwebtoken");
let secretCode = "finalprojectcpe63key";
let session = require("express-session");
let formidable = require("formidable");
let fs = require("fs");
let dayjs = require("dayjs");
let dayFormat = "DD/MM/YYYY";
let numeral = require("numeral");
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const urlencodedParse = bodyParser.urlencoded({extended: false})

//*ต้อง login ผ่านหน้า login เท่านั้น เข้าผ่าน path ไม่ได้มันจะส่งไปหน้า login
function isLogin(req, res, next) {
    if (req.session.token != undefined) {
      next();
    } else {
      res.redirect("/login");
    }
  }


router.get("/", isLogin, async (req, res) => {
    let conn = require("../connect2");
    let params = [];
    try {
      let sql = "SELECT * FROM group_product ORDER BY name";
      let [groupProducts, fileds] = await conn.query(sql, params);
      let sql1 = "SELECT * FROM type_product ORDER BY type";
      let [typeProducts, fields1] = await conn.query(sql1, params);
      res.render("Admin/Product/addproduct", {
        product: {},
        groupProducts: groupProducts,
        typeProducts: typeProducts,
      });
    } catch (err) {}
});

router.post("/", isLogin, (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, file) => {
      let filePath = file.img.filepath;
      let newPath = "C://FinalProjectCPE/app/public/images/";
      newPath += file.img.originalFilename;
  
      fs.copyFile(filePath, newPath, () => {
        //เพิ่มเข้า Database
        let sql =
          "INSERT INTO product(type_product_id, group_product_id, name, price, stock, `describe`, img) VALUES(?, ?, ?, ?, ?, ?, ?)";
        let params = [
          fields["type_product_id"],
          fields["group_product_id"],
          fields["name"],
          fields["price"],
          fields["stock"],
          fields["describe"],
          file.img.originalFilename,
        ];
        conn.query(sql, params, (err, result) => {
          if (err) throw err;
          res.redirect("/product");
          console.log(file.img.originalFilename);
          console.log(result);
          console.log(params);
          console.log(form);
        });
      });
    });
});


module.exports = router;