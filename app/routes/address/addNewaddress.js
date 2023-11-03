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

//-----------addNewaddress-----
router.get("/", isLogin, (req, res) => {
    res.render("user/Profile/addNewaddress");
  });
  
  router.post("/", urlencodedParse, [
    check('name')
    .notEmpty().withMessage('Name field is required'),
    check('phone')
    .notEmpty().withMessage('phone field is required')
    .matches(/^0\d{9}$/).withMessage('Thai phone number must start with 0 and consist of 10 digits'),
    check('home_number')
    .notEmpty().withMessage('home_number field is required'),
    check('mu_number')
    .notEmpty().withMessage('mu_number field is required'),
    check('tambun')
    .notEmpty().withMessage('tambun field is required'),
    check('district')
    .notEmpty().withMessage('district field is required'),
    check('province')
    .notEmpty().withMessage('province field is required'),
    check('zip_code')
    .notEmpty().withMessage('zip_code field is required')
    .matches(/^\d{5}$/).withMessage('Zip code must be a 5-digit number'),
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
      const alert = errors.array()
      res.render("user/Profile/addNewaddress", {alert});
    } else {
      let uid = req.session.user;
    let sql =
      "INSERT INTO `useraddress`(user_id, name, phone, home_number, mu_number, tambun, district, province, zip_code) VALUES(?, ? ,?, ?, ?, ?, ?, ?, ?)";
    let params = [
      uid,
      req.body["name"],
      req.body["phone"],
      req.body["home_number"],
      req.body["mu_number"],
      req.body["tambun"],
      req.body["district"],
      req.body["province"],
      req.body["zip_code"],
    ];
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
      res.redirect("/trackOrder");
    });
    }
});



module.exports = router;