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
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const urlencodedParse = bodyParser.urlencoded({ extended: false });

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
    let params = [];
    try {
      let sql = "SELECT * FROM delivery_company ORDER BY deliverycompany_name";
      let [DeliveryCompany, fileds] = await conn.query(sql, params);
      res.render("admin/Delivery/deliveryOrder", { orderId: req.params.id, DeliveryCompany: DeliveryCompany });
    } catch (err) {}
});

router.post("/:id", isLogin, urlencodedParse,
  [
    check("track_name")
      .notEmpty()
      .withMessage("The name of the delivery company must be specified."),
    check("track_code")
      .notEmpty()
      .withMessage("A Tracking number must be provided."),
    check("delivery_date")
      .notEmpty()
      .withMessage("Must specify delivery date."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("admin/Delivery/deliveryOrder", {
        orderId: req.params.id,
        alert,
      });
    } else {
      let delivery = "delivery complete";
      let sql =
        "UPDATE `order` SET status = ?, delivery_date = ?, track_name = ?, track_code = ?, send_remark = ? WHERE id = ?";
      let params = [
        delivery,
        req.body["delivery_date"],
        req.body["track_name"],
        req.body["track_code"],
        req.body["send_remark"],
        req.params.id,
      ];

      conn.query(sql, params, (err, result) => {
        if (err) throw err;
        res.render("admin/Delivery/deliveryOrderSuccess");
      });
    }
  }
);

module.exports = router;
