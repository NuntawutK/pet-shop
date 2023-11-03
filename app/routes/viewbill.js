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


  router.get("/:id", async (req, res) => {
    let conn2 = require("./connect2");
    let sql = "";
    sql += " SELECT orderdetail.*, product.name, product.img FROM orderdetail";
    sql += " LEFT JOIN product ON product.id = orderdetail.product_id";
    sql += " WHERE orderdetail.order_id = ?";
    sql += " ORDER BY orderdetail.id DESC";
    let params = [req.params.id];
    let totalQty = 0;
    let totalPrice = 0;
  
    let sql1 =
      "SELECT * FROM `order` INNER JOIN `useraddress` ON `order`.address_id = `useraddress`.id WHERE `order`.id = ?";
    let [address, fields] = await conn2.query(sql1, params);
  
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
  
      for (let i = 0; i < result.length; i++) {
        let orderDetail = result[i];
        totalQty += orderDetail.qty;
        totalPrice += orderDetail.qty * orderDetail.price;
      }
  
      res.render("admin/Dashboard/viewbill", {
        orderDetails: result,
        totalQty: totalQty,
        totalPrice: totalPrice,
        address: address,
      });
      console.log(params);
      console.log(address);
    });
  });
  


module.exports = router;