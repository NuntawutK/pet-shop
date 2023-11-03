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

  //--------------Show Cart------------------------
  router.get("/", async (req, res) => {
    let conn = require("../connect2");
    let cart = req.session.cart;
    let products = [];
    let totalQty = 0;
    let totalPrice = 0;
  
    if (cart.length > 0) {
      for (let i = 0; i < cart.length; i++) {
        let c = cart[i];
        let sql = "SELECT * FROM product WHERE id = ?";
        let params = [c.product_id];
  
        let [rows, fields] = await conn.query(sql, params);
        let product = rows[0];
        let p = {
          qty: c.qty,
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
        };
        products.push(p);
  
        totalQty += parseInt(c.qty);
        totalPrice += c.qty * product.price;
      }
    }
    res.render("user/Cart/cart", {
      products: products,
      totalQty: totalQty,
      totalPrice: totalPrice,
    });
  });


module.exports = router;