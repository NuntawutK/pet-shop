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

//-------------login----------------------------
router.get("/", function (req, res) {
    res.render("login/login");
  });
  
  router.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.pwd;
  
    let sql = "SELECT * FROM user WHERE username = ?";
    let params = [username];
  
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
  
      if (result.length > 0) {
        const user = result[0];
        bcrypt.compare(password, user.pwd, (bcryptErr, bcryptRes) => {
          if (bcryptErr) throw bcryptErr;
  
          if (bcryptRes) {
            // รหัสผ่านถูกต้อง
            const { id, name, level, email } = user;
            const token = jwt.sign({ id, name }, secretCode);
            req.session.token = token;
            req.session.name = name;
            req.session.level = level;
            req.session.username = username;
            req.session.email = email;
            req.session.user = id;
            if (level === "admin") {
              res.redirect("/home");
            } else if (level === "user") {
              res.redirect("/");
            }
          } else {
            // รหัสผ่านไม่ถูกต้อง
            const alert = [{ msg: "Username or Password not found" }];
            res.render('login/login', { alert });
          }
        });
      } else {
        // ไม่พบผู้ใช้งาน
        const alert = [{ msg: "Username or Password not found" }];
        res.render('login/login', { alert });
      }
    });
  });
  //-----------------------------------------------------


module.exports = router;