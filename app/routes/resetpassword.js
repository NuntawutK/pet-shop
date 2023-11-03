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


  function checkEmailsuccess(req, res, next) {
    if (req.session.email != undefined) {
      next();
    } else {
      res.redirect("/checkEmail");
    }
  }
  
  router.get("/", checkEmailsuccess, (req, res) => {
    console.log(req.session.email);
    res.render("login/resetpassword");
  })
  
  router.post("/", checkEmailsuccess, urlencodedParse, [
    check('pwd')
    .notEmpty().withMessage('Password field is required')
    .matches(/^[A-Z][a-zA-Z0-9]*$/).withMessage('Password must start with an uppercase letter and contain at least 1 letter or number')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('pwd2')
    .custom((value, { req }) => {
      if (value !== req.body.pwd) {
        throw new Error('Passwords do not match');
      }
      return true;
    }).withMessage('Passwords do not match'),
  ], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array()
  
        res.render("login/resetpassword", {alert});
    } else {
      bcrypt.hash(req.body["pwd"], 10, (err, hash) => {
        if (err) throw err;
  
        let sql = "UPDATE user SET pwd = ? WHERE email = ?";
        let params = [
          hash, // ใช้ค่าแฮชแทนรหัสผ่านใหม่
          req.session.email
        ];
        conn.query(sql, params, (err, result) => {
          if (err) throw err;
          res.redirect("/login");
        });
      });
    }
  })
  



module.exports = router;