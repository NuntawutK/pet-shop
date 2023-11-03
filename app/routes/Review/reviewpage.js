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

router.get("/:id", isLogin, (req,res) => {
    res.render("user/Review/Reviewpage");
  })
  
  router.post("/:id", isLogin, (req,res)=> {
    let uid = req.session.user;
    let product_id = req.params.id;
    let date = new Date().toJSON().slice(0, 10);
    let sql = "INSERT INTO review(user_id, product_id, rating, comment, date) VALUES(?, ?, ?, ?, ?)";
    let params = [
      uid,
      product_id,
      req.body["rating"],
      req.body["comment"],
      date
    ];
    conn.query(sql, params, (err, result)=> {
      if (err) throw err;
      res.redirect("/paymainpage")
    })
  })


module.exports = router;