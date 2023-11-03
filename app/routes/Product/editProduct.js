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


router.get("/:id", isLogin, async (req, res) => {
    let conn = require("../connect2");
    let params = req.params.id;
    let result = [];
    try {
      let sql = "SELECT * FROM product WHERE id = ?";
      let [product, fields] = await conn.query(sql, params);
      let sql2 = "SELECT * FROM group_product ORDER BY name";
      let [groupProducts, fields2] = await conn.query(sql2, result);
      let sql3 = "SELECT * FROM type_product ORDER BY type";
      let [typeProducts, fields3] = await conn.query(sql3, result);
      res.render("Admin/Product/editproduct", {
        product: product[0],
        groupProducts: groupProducts,
        typeProducts: typeProducts,
      });
    } catch (err) {}
  });
  
  router.post("/:id", isLogin, (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, file) => {
      let newPath = "C://FinalProjectCPE/app/public/images/";
  
      // ตรวจสอบว่ามีการอัปโหลดรูปใหม่หรือไม่
      if (file.img.size > 0) {
        let filePath = file.img.filepath;
        let Pathupload = newPath + file.img.originalFilename;
  
        fs.copyFile(filePath, Pathupload, () => {
          let sqlSelect = "SELECT img FROM product WHERE id = ?";
          let paramSelect = req.params.id;
  
          conn.query(sqlSelect, paramSelect, (err, oldProduct) => {
            if (err) throw err;
            let product = oldProduct[0];
            fs.unlink(newPath + product.img, () => {
              // อัปเดตเข้า Database
              let sql =
                "UPDATE product SET type_product_id=?, group_product_id=?, name=?, price=?, `describe`=?, img=? WHERE id=?";
              let params = [
                fields["type_product_id"],
                fields["group_product_id"],
                fields["name"],
                fields["price"],
                fields["describe"],
                file.img.originalFilename,
                req.params.id,
              ];
              conn.query(sql, params, (err, result) => {
                if (err) throw err;
                res.redirect("/product");
              });
            });
          });
        });
      } else {
        // ไม่มีการอัปโหลดรูปใหม่ อัปเดตเฉพาะข้อมูลอื่น ๆ
        let sql =
          "UPDATE product SET type_product_id=?, group_product_id=?, name=?, price=?, `describe`=? WHERE id=?";
        let params = [
          fields["type_product_id"],
          fields["group_product_id"],
          fields["name"],
          fields["price"],
          fields["describe"],
          req.params.id,
        ];
        conn.query(sql, params, (err, result) => {
          if (err) throw err;
          res.redirect("/product");
        });
      }
    });
});



module.exports = router;