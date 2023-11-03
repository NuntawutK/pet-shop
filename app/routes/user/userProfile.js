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

//-------------------userProfile-------------------------
router.get("/", isLogin, (req, res) => {
    let data = jwt.verify(req.session.token, secretCode);
    let sql = "SELECT * FROM user WHERE id = ?";
    let params = [data.id];
  
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
      res.render("user/Profile/userProfile", { user: result[0] });
    });
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
  ], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array()
  
        let data = jwt.verify(req.session.token, secretCode);
        let sql = "SELECT * FROM user WHERE id = ?";
        let params = [data.id];
  
      conn.query(sql, params, (err, result) => {
        if (err) throw err;
      res.render("user/Profile/userProfile", { user: result[0] ,alert});
    });
    } else {
      let data = jwt.verify(req.session.token, secretCode);
      let sql = "UPDATE user SET name = ?, username = ?, email = ? WHERE id = ?";
      let params = [
        req.body["name"],
        req.body["username"],
        req.body["email"],
       data.id,
    ];
  
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
      res.redirect("/login");
    });
    }
   
  });

module.exports = router;