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
    let sql = "SELECT * FROM delivery_company WHERE id = ?";
    let params = req.params.id;
  
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
      res.render("Admin/Delivery/addDeliveryCompany", {
        DeliveryCompany: result[0],
      });
    });
  });
  
  router.post("/:id", isLogin,urlencodedParse, [
    check('deliverycompany_name')
      .notEmpty().withMessage('Delivery company is required'),
  ], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      const alert = errors.array()
      let sql = "SELECT * FROM delivery_company WHERE id = ?";
    let params = req.params.id;
  
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
      res.render("Admin/Delivery/addDeliveryCompany", {
        DeliveryCompany: result[0], 
        alert
      });
    });
    } else{
      let sql = "UPDATE delivery_company SET deliverycompany_name = ? WHERE id = ?";
      let params = [req.body["deliverycompany_name"], req.params.id];
      conn.query(sql, params, (err, result) => {
        if (err) throw err;
      res.redirect("/DeliveryCompany");
    });
    }
   
  });


module.exports = router;