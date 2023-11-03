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


router.post("/", (req, res) => {
    let sql = "SELECT * FROM user WHERE email = ?";
    let params = [req.body["email"]];
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
  
      if (result.length > 0) {
        let user = result[0];
        let id = result[0].id;
        let name = result[0].name;
        let token = jwt.sign({ id: id, name: name }, secretCode);
        req.session.token = token;
        req.session.name = name;
        req.session.level = user.level;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.user = user.id;
        console.log(req.session.email);
        res.redirect("/resetpassword");
      } else {
        let alert = [{ msg: "Your email not found" }];
        res.render('login/forgetPassword', { alert });
      }
    });
  })




module.exports = router;