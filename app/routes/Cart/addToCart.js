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
//---------------Add To Cart--------------------
router.get("/:id", (req, res) => {
    let cart = [];
    let order = {
      product_id: req.params.id,
      qty: 1,
    };
    if (req.session.cart == null) {
      //**Frist item */
      cart.push(order);
    } else {
      cart = req.session.cart;
      let newitem = true;
      //plus old item
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product_id == req.params.id) {
          cart[i].qty = cart[i].qty + 1;
          newitem = false;
        }
      }
      // plus new item
      if (newitem) {
        cart.push(order);
      }
    }
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/#categories");
  });


module.exports = router;