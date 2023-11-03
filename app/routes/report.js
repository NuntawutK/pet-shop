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

router.get("/", isLogin, async (req, res) => {
  let conn = require("./connect2");
  let y = dayjs().year();
  let yForLoop = dayjs().year();
  let m = dayjs().month() + 1;
  let daysInMonth;

  // ปรับปีและเดือนจากคิวรี่พารามิเตอร์ (ถ้ามี)
  if (req.query["year"] != undefined) {
    y = req.query["year"];
    m = req.query["month"];
  }

  // กำหนดจำนวนวันในเดือน
  if (m === 2) {
    // กุมภาพันธ์มี 28 วัน (หรือ 29 วัน ในปีอธิกสุรทิน)
    daysInMonth = dayjs(`${y}-${m}-1`).isLeapYear() ? 29 : 28;
  } else if (["4", "6", "9", "11"].includes(m.toString())) {
    // เดือนที่ลงท้ายด้วย "คม" มี 31 วัน
    daysInMonth = 30;
  } else {
    // เดือนที่ลงท้ายด้วย "ยน" มี 30 วัน
    daysInMonth = 31;
  }

  let arr = [];
  let arrYears = [];
  let arrMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฏาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  for (let i = 1; i <= daysInMonth; i++) {
    let sql = "";
    sql += " SELECT SUM(qty * price) AS totalPrice FROM orderdetail";
    sql += " LEFT JOIN `order` ON order.id = orderdetail.order_id";
    sql += " WHERE DAY(order.pay_date) = ?";
    sql += " AND MONTH(order.pay_date) = ?";
    sql += " AND YEAR(order.pay_date) = ?";

    let params = [i, m, y];
    let [rows, fields] = await conn.query(sql, params);
    arr.push(rows[0].totalPrice);
  }

  for (let i = yForLoop - 4; i <= yForLoop; i++) {
    arrYears.push(i);
  }

  res.render("admin/Report/report", {
    arr: arr,
    y: y,
    m: m,
    arrYears: arrYears,
    arrMonths: arrMonths,
  });
});

module.exports = router;
