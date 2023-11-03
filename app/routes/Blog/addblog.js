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
    res.render("admin/Blog/addBlog", { blog: {} });
  });
  
  router.post("/", isLogin, (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, file) => {
      let filePath = file.img.filepath;
      let newPath = "C://FinalProjectCPE/app/public/designimg/";
      newPath += file.img.originalFilename;
  
      fs.copyFile(filePath, newPath, () => {
        //เพิ่มเข้า Database
        let date = new Date().toJSON().slice(0, 10);
        let sql =
          "INSERT INTO blog(title, detail, date, img) VALUES(?, ?, ?, ?)";
        let params = [
          fields['title'],
          fields['detail'],
          date,
          file.img.originalFilename
        ];
        conn.query(sql, params, (err, result) => {
          if (err) throw err;
          res.redirect("/showblog");
        });
      });
    });
  });
  


module.exports = router;