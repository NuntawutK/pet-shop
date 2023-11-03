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


  router.get("/:id", (req, res) => {
    let sql = "SELECT * FROM product WHERE id = ?";
    let params = req.params.id;
    conn.query(sql, params, (err, result) => {
      if (err) throw err;
      let product = result[0];
      let cart = req.session.cart;
  
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product_id == product.id) {
          product.qty = cart[i].qty;
        }
      }
      res.render("user/Cart/editItemInCart", {
        product: product,
      });
    });
  });
  
  router.post("/:id", (req, res) => {
    let cart = req.session.cart;
  
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].product_id == req.params.id) {
        cart[i].qty = req.body["qty"];
      }
    }
    req.session.cart = cart;
    res.redirect("/cart");
  });
  //-----------------------------------------------------

module.exports = router;