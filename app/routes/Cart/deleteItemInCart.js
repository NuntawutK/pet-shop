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
    let cart = req.session.cart;
  
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].product_id == req.params.id) {
        cart.splice(i, 1);
      }
    }
  
    req.session.cart = cart;
    res.redirect("/cart");
  });


module.exports = router;