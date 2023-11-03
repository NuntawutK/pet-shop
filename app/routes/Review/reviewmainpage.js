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


router.get("/:id", isLogin, (req, res) => {
    let sql = "";
    sql += " SELECT orderdetail.*, product.name, product.img FROM orderdetail";
    sql += " LEFT JOIN product ON product.id = orderdetail.product_id";
    sql += " WHERE orderdetail.order_id = ?";
    sql += " ORDER BY orderdetail.id DESC";
  
    let params = [req.params.id];
    let totalQty = 0;
    let totalPrice = 0;
  
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
  
      for (let i = 0; i < result.length; i++) {
        let orderDetail = result[i];
        totalQty += orderDetail.qty;
        totalPrice += orderDetail.qty * orderDetail.price;
      }
  
      res.render("user/Review/Reviewmainpage", {
        orderDetails: result,
        totalQty: totalQty,
        totalPrice: totalPrice,
      });
      console.log(result);
    });
});


module.exports = router;