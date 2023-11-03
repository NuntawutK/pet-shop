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

//-------------Product------------------------------
router.get("/", isLogin, async (req, res) => {
    let conn = require("../connect2");
    let params = [];
    try {
      let sql =
        "" +
        " SELECT product.*, group_product.name AS group_product_name FROM product" +
        " LEFT JOIN group_product ON group_product.id = product.group_product_id" +
        " ORDER BY product.id DESC";
      let [products, fields] = await conn.query(sql, params);
  
      let sql2 =
        "" +
        " SELECT product.*, type_product.type AS type_product_type FROM product" +
        " LEFT JOIN type_product ON type_product.id = product.type_product_id" +
        " ORDER BY product.id DESC";
      let [typeproducts, fields2] = await conn.query(sql2, params);
      res.render("Admin/Product/product", {
        products: products,
        typeproducts: typeproducts,
      });
    } catch (err) {}
  });


module.exports = router;