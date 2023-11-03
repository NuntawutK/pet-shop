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

//*ต้อง login ผ่านหน้า login เท่านั้น เข้าผ่าน path ไม่ได้มันจะส่งไปหน้า login
function isLogin(req, res, next) {
    if (req.session.token != undefined) {
      next();
    } else {
      res.redirect("/login");
    }
  }

//--------addStock-------
router.get("/:id", isLogin, (req, res) => {
    let sql = "SELECT * FROM product WHERE id = ?";
    let params = req.params.id;
  
    conn.query(sql, params, (err, products) => {
      if (err) throw err;
      sql = "SELECT * FROM group_product ORDER BY name";
      conn.query(sql, (err, groupProducts) => {
        if (err) throw err;
        res.render("admin/Product/addstock", {
          product: products[0],
          groupProducts: groupProducts,
        });
      });
    });
  });
  
  router.post("/:id", isLogin, async (req, res) => {
    let conn = require("./connect2");
    let sqlstock = "SELECT stock FROM product WHERE id = ?";
    let paramsStock = [req.params.id];
    let date = new Date().toJSON().slice(0, 10);
    try {
      let sqlselect = "SELECT * FROM product WHERE id = ?";
      let paramsSelect = req.params.id;
  
      await conn.query(sqlselect, paramsSelect);
  
      let [stock] = await conn.query(sqlstock, paramsStock);
      let total_stock = 0;
      //เพิ่มเข้า Database
      let sql = "UPDATE product SET stock=?, stock_in=? WHERE id=?";
      let params = [
        (total_stock = stock[0].stock + parseInt(req.body["stock"])),
        date,
        req.params.id,
      ];
      await conn.query(sql, params);
  
      res.redirect("/product");
      console.log(stock);
    } catch (err) {}
  });
  


module.exports = router;