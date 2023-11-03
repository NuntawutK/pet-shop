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

//------------------forgetpassword-------------------------
router.get("/" , (req ,res) => {
    res.render("login/forgetPassword");
})


module.exports = router;