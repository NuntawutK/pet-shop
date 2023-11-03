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


router.get("/:id", isLogin, (req, res) => {
    let sql = "SELECT * FROM blog WHERE id = ?";
    let params = req.params.id;
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
      res.render("admin/blog/editBlog", { blog: result[0] });
    });
  });
  
  router.post("/:id", isLogin, (req, res) => {
    let form = new formidable.IncomingForm();
    let date = new Date().toJSON().slice(0, 10);
    form.parse(req, (err, fields, file) => {
      let newPath = "C://FinalProjectCPE/app/public/designimg/";
  
      if (file.img.size > 0){
        let filePath = file.img.filepath;
        let Pathupload = newPath + file.img.originalFilename;
  
        fs.copyFile(filePath, Pathupload, () => {
          let sqlselect = "SELECT img FROM blog WHERE id = ?"
          let paramSelect = req.params.id;
  
          conn.query(sqlselect, paramSelect, (err, oldBlog) => {
            if (err) throw err;
            let blog = oldBlog[0];
            fs.unlink(newPath + blog.img, () =>{
              let sql = "UPDATE blog SET title = ?, detail = ?, date = ?, img = ? WHERE id = ?";
              let params = [
                fields["title"],
                fields["detail"],
                date,
                file.img.originalFilename,
                req.params.id,
                ];
                conn.query(sql, params, (err, result) => {
                  if (err) throw err;
                  res.redirect("/showblog");
                });
            })
          })
        });
      } else {
        let sql = "UPDATE blog SET title = ?, detail = ?, date = ? WHERE id = ?";
              let params = [
                fields["title"],
                fields["detail"],
                date,
                req.params.id,
                ];
                conn.query(sql, params, (err, result) => {
                  if (err) throw err;
                  res.redirect("/showblog");
                });
      }
    });
});



module.exports = router;