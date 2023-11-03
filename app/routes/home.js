const express = require("express");
let router = express.Router();
let conn = require("./connect");
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
    let conn = require("./connect2");
    let params = [];
    try {
      let sql =
        " SELECT SUM(qty * price) AS totalPrice, SUM(qty) AS allQty FROM orderdetail";
      let [allPrice, totalfields] = await conn.query(sql, params);
      let sql1 = "SELECT * FROM `order` ORDER BY id DESC";
      let [order, fields] = await conn.query(sql1, params);
      let sql2 = "SELECT * FROM user ORDER BY id DESC";
      let [user, fieldsuser] = await conn.query(sql2, params);
      let sql3 =
        "SELECT * FROM `order` INNER JOIN `useraddress` ON `order`.address_id = `useraddress`.id";
      let [userdetail, userfields] = await conn.query(sql3, params);
      let sql4 = "SELECT COUNT(id) AS allOrder FROM `order`";
      let [allorder, allfields] = await conn.query(sql4, params);
  
      res.render("Admin/Dashboard/home", {
        orders: order,
        users: user,
        userdetails: userdetail,
        allPrice: allPrice,
        allorder: allorder,
      });
      console.log(user);
      console.log(order);
      console.log(userdetail);
      console.log(allPrice);
      console.log(allorder);
    } catch (err) {}
  });


module.exports = router;