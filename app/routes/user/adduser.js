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

router.get("/", isLogin, (req, res) => {
    res.render("Admin/User/adduser", { user: {} });
  });
  
  router.post("/", isLogin, urlencodedParse, [
    check('name')
      .notEmpty().withMessage('Name field is required')
      .isLength({ min:3 }).withMessage('This name must be 3+ characters long'),
    check('username')
      .notEmpty().withMessage('Username field is required')
      .isLength({ min:3 }).withMessage('This username must be 3+ characters long'),
    check('email', 'Email is not valid')
      .notEmpty().withMessage('Email field is required')
      .isEmail()
      .normalizeEmail(),
    check('pwd')
    .notEmpty().withMessage('Password field is required')
    .matches(/^[A-Z][a-zA-Z0-9]*$/).withMessage('Password must start with an uppercase letter and contain at least 1 letter or number')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('level')
    .notEmpty().withMessage('Please select user role'),
  ], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array()
  
        res.render("Admin/User/adduser", { user: {} , alert});
    } else {
      const sql = "INSERT INTO user SET ?";
      const params = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        pwd: '', // ไม่ต้องแฮชรหัสผ่านในนี้
      };
  
      bcrypt.hash(req.body.pwd, 10, (err, hash) => {
        if (err) throw err;
        params.pwd = hash; // กำหนดค่าแฮชให้กับฟิลด์ pwd
  
        conn.query(sql, params, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      });
    }
  });




module.exports = router;