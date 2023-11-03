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

router.post("/:id", isLogin, (req, res) => {
    let uid = req.session.user;
    let product_id = req.params.id;
    let checkIfExistsSql = "SELECT * FROM favorite WHERE user_id = ? AND product_id = ?";
    let checkIfExistsParams = [uid, product_id];

    // ตรวจสอบว่าข้อมูลอยู่ในฐานข้อมูลหรือไม่
    conn.query(checkIfExistsSql, checkIfExistsParams, (err, rows) => {
        if (err) throw err;

      // ถ้ามีข้อมูลอยู่แล้วให้ลบข้อมูลนั้น
        if (rows.length > 0) {
            let deleteSql = "DELETE FROM favorite WHERE user_id = ? AND product_id = ?";
            conn.query(deleteSql, checkIfExistsParams, (err, result) => {
                if (err) throw err;
                    res.redirect('/favorite')
            });
        } else {
        // ถ้าไม่มีข้อมูลให้เพิ่มข้อมูลใหม่
        let insertSql = "INSERT INTO favorite(user_id, product_id) VALUES(?, ?)";
        conn.query(insertSql, checkIfExistsParams, (err, result) => {
            if (err) throw err;
            res.redirect('/favorite')
        });
        }
    });
});


module.exports = router;