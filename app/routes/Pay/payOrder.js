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

//----------------------Pay Order--------------------------------
router.get("/:id", isLogin, (req, res) => {
    let sql = "";
    sql += " SELECT orderdetail.*, product.name, product.img FROM orderdetail";
    sql += " LEFT JOIN product ON product.id = orderdetail.product_id";
    sql += " WHERE orderdetail.order_id = ?";
    sql += " ORDER BY orderdetail.id DESC";
  
    let params = [req.params.id];
    let totalQty = 0;
    let totalPrice = 0;
  
    conn.query(sql, params, (err, results) => {
      if (err) throw err;
  
      for (let i = 0; i < results.length; i++) {
        let orderDetail = results[i];
        totalQty += orderDetail.qty;
        totalPrice += orderDetail.qty * orderDetail.price;
      }

      res.render("user/pay/payorder", {
        orderDetails: results,
        totalQty: totalQty,
        totalPrice: totalPrice,
        orderId: req.params.id,
      });
      console.log(results);
      console.log(totalQty);
      console.log(totalPrice);
      console.log(req.params.id);
    });
  });
  

  
  router.post("/:id", isLogin, (req, res) => {
      let form = new formidable.IncomingForm();
      form.parse(req, (err, fields, file) => {
      let filePath = file.img.filepath;
      let newPath = "C://FinalProjectCPE/app/public/PaymentImages/";
      newPath += file.img.originalFilename;
      let paycomplete = "payment is complete";
      fs.copyFile(filePath, newPath, () => {
        let sql =
          "UPDATE `order` SET status = ?, pay_date = ?, pay_remark = ?, img = ? WHERE id = ?";
        let params = [
          paycomplete,
          fields["pay_date"],
          fields["pay_remark"],
          file.img.originalFilename,
          req.params.id,
        ];
        conn.query(sql, params, (err, result) => {
          if (err) throw err;
          res.render("user/pay/payOrderSuccess");
          console.log(form);
          console.log(params);
        });
      });
    });
  });
  


module.exports = router;