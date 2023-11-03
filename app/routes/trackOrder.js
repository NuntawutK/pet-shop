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

  router.get("/", isLogin, (req, res) => {
    let sql = "SELECT * FROM `useraddress` WHERE user_id = ?";
    let params = req.session.user;
    conn.query(sql, params, (err, results) => {
      if (err) throw err;
      res.render("user/Trackorder/trackOrder", { orders: [], uaddress: results });
      console.log(params);
    });
  });
  
  router.post("/", isLogin, async (req, res) => {
    let conn = require("./connect2");
    let params1 = req.body["phone"];
    let params2 = [req.session.user];
    console.log(params2);
    try {
      let sql1 = "SELECT * FROM `order` INNER JOIN `useraddress` ON `order`.address_id = `useraddress`.id INNER JOIN `delivery_company` ON `order`.track_name = `delivery_company`.id WHERE phone = ? AND pay_date IS NOT NULL";

      let [orders, fields] = await conn.query(sql1, params1);
      let sql2 = "SELECT * FROM `useraddress` WHERE user_id = ?";
      let [uaddress, fieldsuseraddress] = await conn.query(sql2, params2);
      res.render("user/Trackorder/trackOrder", {
        orders: orders,
        uaddress: uaddress,
      });
      console.log(uaddress)
    } catch (err) {}
  });
  
  


module.exports = router;