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

//------------------------confirmOrder-----------------
router.get("/", isLogin, (req, res) => {
    let sql = "SELECT * FROM `useraddress` WHERE user_id = ?";
    let params = req.session.user;
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
      res.render("user/Comfirmorder/confirmOrder", { uaddress: result });
      console.log(result);
    });
  });
  
  router.post("/", isLogin, urlencodedParse, [
    check('address_id')
      .notEmpty().withMessage('Please select your shipping address')
  ], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      const alert = errors.array()
      let sql = "SELECT * FROM `useraddress` WHERE user_id";
      let params = req.body["user_id"];
      conn.query(sql, params, (err, result) => {
        if (err) throw err;
      res.render("user/Comfirmorder/confirmOrder", { uaddress: result, alert });
    });
    } else {
       let conn = require("../connect2");
    let uid = req.session.user;
    let sqluser =
      "SELECT * FROM `useraddress` WHERE id = ? ORDER BY user_id DESC";
    let userparams = [req.body.id, req.body["address_id"]];
    let sql =
      "INSERT INTO `order`(user_id, address_id, confirm_date) VALUES(?, ?, NOW())";
    let confirmparams = [uid, req.body["address_id"]];
    try {
      let [rows, fields] = await conn.query(sql, confirmparams);
      let [result_s] = await conn.query(sqluser, userparams);
  
      //เก็บค่า last id ไป ใช้ insert orderdetail
      let lastId = rows.insertId;
      let carts = req.session.cart;
  
      for (let i = 0; i < carts.length; i++) {
        let cart = carts[i];
        //หาราคาจากสินค้า
        let sqlFindProduct = "SELECT price FROM product WHERE id = ?";
        params = [cart.product_id];
        let [rows, fields] = await conn.query(sqlFindProduct, params);
        let price = rows[0].price;
        let sqlOrderDetail =
          "INSERT INTO orderdetail(order_id, product_id, qty, price) VALUES(?, ?, ?, ?)";
        params = [lastId, cart.product_id, cart.qty, price];
        await conn.query(sqlOrderDetail, params);
  
        let sqlstock = "SELECT stock FROM product WHERE id = ?";
        let paramsStock = [cart.product_id];
        let [stock] = await conn.query(sqlstock, paramsStock);
  
        let total_stock = stock[0].stock - cart.qty;
  
        let sqlUpdatestock = "UPDATE product SET stock=? WHERE id = ?";
        let paramsUpdateStock = [total_stock, cart.product_id];
        let [total_s] = await conn.query(sqlUpdatestock, paramsUpdateStock);
      }
    } catch (err) {
      res.send(err);
    }
    req.session.cart = [];
    res.redirect("/confirmOrderSuccess");
    }
  });



module.exports = router;