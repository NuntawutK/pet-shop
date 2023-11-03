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


//----Group product-----------------
router.get("/", isLogin, async (req, res) => {
    let conn = require("../connect2");
    let params = [];
    try {
      let sql = "SELECT * FROM group_product ORDER BY id DESC";
      let [groupProducts, result] = await conn.query(sql, params);
      let sql1 = "SELECT * FROM type_product ORDER BY id DESC";
      let [typeProducts, typeresult] = await conn.query(sql1, params);
  
      res.render("Admin/GroupProduct/groupProduct", {
        groupProducts: groupProducts,
        typeProducts: typeProducts,
      });
    } catch (err) {}
  });
  


module.exports = router;