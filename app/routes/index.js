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
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

router.use(express.static("public"));
router.use(bodyParser.raw({ type: "application/json" }));
router.use(express.json());

const urlencodedParse = bodyParser.urlencoded({ extended: false });

const addNewaddress = require("./address/addNewaddress");
const deleteaddress = require("./address/deleteaddress");
const editaddress = require("./address/editaddress");

const blog = require("./Blog/blog");
const addblog = require("./Blog/addblog");
const editblog = require("./Blog/editblog");
const deleteblog = require("./Blog/deleteblog");
const showblog = require("./Blog/showblog");
const contentblog = require('./Blog/contentblog');

const cart = require("./Cart/cart");
const addToCart = require("./Cart/addToCart");
const deleteItemInCart = require("./Cart/deleteItemInCart");
const editItemInCart = require("./Cart/editItemInCart");

const confirmOrder = require("./confirmorder/confirmOrder");
const confirmOrderSuccess = require("./confirmorder/confirmOrdersuccess");

const delivery = require("./Delivery/delivery");
const DeliveryCompany = require("./Delivery/DeliveryCompany");
const addDeliveryCompany = require("./Delivery/addDeliveryCompany");
const editDeliveryCompany = require("./Delivery/editDeliveryCompany");
const deleteDeliveryCompany = require("./Delivery/deleteDeliveryCompany");

const favorite = require("./Favorite/favorite");
const addfavorite = require("./Favorite/addfavorite");

const forgetpassword = require("./forgetpassword");

const groupProduct = require("./GroupProduct/groupProduct");
const addGroupProduct = require("./GroupProduct/addGroupProduct");
const deleteGroupProduct = require("./GroupProduct/deleteGroupProduct");
const editgroupProduct = require("./GroupProduct/editGroupProduct");

const home = require("./home");

const login = require("../routes/login");

const logout = require("../routes/logout");

const order = require("./Order/order");
const deleteOrder = require("./Order/deleteOrder");
const orderDetail = require("./Order/orderDetail");

const paymainpage = require("./Pay/paymainpage");
const payOrder = require("./Pay/payOrder");
const userdeleteOrder = require("./Pay/userdeleteOrder");

const product = require("./Product/product");
const addProduct = require("./Product/addProduct");
const deleteProduct = require("./Product/deleteProduct");
const editProduct = require("./Product/editProduct");

const register = require("../routes/register");

const report = require("../routes/report");

const resetpassword = require("../routes/resetpassword");

const reviewmainpage = require("./Review/reviewmainpage");
const reviewpage = require("./Review/reviewpage");

const stock = require("../routes/stock");

const trackOrder = require("../routes/trackOrder");

const addtypeProduct = require("./TypeProduct/addtypeProduct");
const deletetypeProduct = require("./TypeProduct/deletetypeProduct");
const edittypeProduct = require("./TypeProduct/edittypeProduct");

const userProfile = require("./user/userProfile");
const userRouter = require("./user/userRouter");
const adduser = require("./user/adduser");
const deleteuser = require("./user/deleteuser");
const edituser = require("./user/edituser");

const viewbill = require("../routes/viewbill");

const checkEmail = require("../routes/checkEmail");

router.use(
  session({
    secret: "projectCPE63",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

router.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.numeral = numeral;
  res.locals.dayjs = dayjs;
  res.locals.dayFormat = dayFormat;
  next();
});

router.use("/addNewaddress", addNewaddress);
router.use("/deleteaddress", deleteaddress);
router.use("/editaddress", editaddress);

router.use("/addblog", addblog);
router.use("/blog", blog);
router.use("/deleteblog", deleteblog);
router.use("/editblog", editblog);
router.use("/showblog", showblog);
router.use("/contentblog", contentblog);

router.use("/addToCart", addToCart);
router.use("/cart", cart);
router.use("/deleteItem", deleteItemInCart);
router.use("/editItemInCart", editItemInCart);

router.use("/confirmOrder", confirmOrder);
router.use("/confirmOrderSuccess", confirmOrderSuccess);

router.use("/addgroupProduct", addGroupProduct);
router.use("/deletegroupProduct", deleteGroupProduct);
router.use("/editgroupProduct", editgroupProduct);
router.use("/groupProduct", groupProduct);

router.use("/order", order);
router.use("/deleteOrder", deleteOrder);
router.use("/orderDetail", orderDetail);

router.use("/paymainpage", paymainpage);
router.use("/payOrder", payOrder);
router.use("/customerdeleteOrder", userdeleteOrder);

router.use("/addproduct", addProduct);
router.use("/deleteproduct", deleteProduct);
router.use("/editproduct", editProduct);
router.use("/product", product);

router.use("/reviewmainpage", reviewmainpage);
router.use("/review", reviewpage);

router.use("/addtypeProduct", addtypeProduct);
router.use("/deletetypeProduct", deletetypeProduct);
router.use("/edittypeProduct", edittypeProduct);

router.use("/adduser", adduser);
router.use("/deleteuser", deleteuser);
router.use("/edituser", edituser);
router.use("/userProfile", userProfile);
router.use("/user", userRouter);

router.use("/deliveryOrder", delivery);
router.use("/DeliveryCompany", DeliveryCompany);
router.use("/addDeliveryCompany", addDeliveryCompany);
router.use("/editDeliveryCompany", editDeliveryCompany);
router.use("/deleteDeliveryCompany", deleteDeliveryCompany);

router.use("/favorite", favorite);
router.use("/addfavorite", addfavorite);

router.use("/forgetpassword", forgetpassword);

router.use("/checkEmail", checkEmail);

router.use("/home", home);

router.use("/login", login);
router.use("/logout", logout);
router.use("/register", register);
router.use("/resetpassword", resetpassword);
router.use("/reportSalePerDay", report);
router.use("/addstock", stock);
router.use("/trackOrder", trackOrder);
router.use("/viewbill", viewbill);

/* GET home page. */
router.get("/", async function (req, res, next) {
  let conn = require("./connect2");
  let params = [];
  let uid = req.session.user;
  let sql = "SELECT * FROM product";
  if (req.query.search != undefined) {
    sql += " WHERE name LIKE(?)";
    params.push("%" + req.query.search + "%");
  }
  if (req.query.groupProductId != undefined) {
    sql += " WHERE group_product_id = ?";
    params.push(req.query.groupProductId);
  }
  if (req.query.typeProductId != undefined) {
    sql += " WHERE type_product_id = ?";
    params.push(req.query.typeProductId);
  }
  sql += " ORDER BY RAND()";
  try {
    let [products, fields] = await conn.query(sql, params);
    sql = "SELECT * FROM group_product ORDER BY name DESC";
    let [groupProducts, fieldsGruopProduct] = await conn.query(sql);
    sql2 = "SELECT * FROM type_product ORDER BY type DESC";
    let [typeProducts, fieldsTypeProduct] = await conn.query(sql2);
    // Cart start = 0
    if (req.session.cart == undefined) {
      req.session.cart = [];
    }
    res.render("user/Home/index", {
      products: products,
      groupProducts: groupProducts,
      uid: uid,
      typeProducts: typeProducts,
    });
    console.log(uid);
  } catch (err) {
    res.send("ERROR : " + err);
  }
});

//*ต้อง login ผ่านหน้า login เท่านั้น เข้าผ่าน path ไม่ได้มันจะส่งไปหน้า login
function isLogin(req, res, next) {
  if (req.session.token != undefined) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/seeproduct/:id", async (req, res) => {
  let conn = require("./connect2");
  let params = req.params.id;
  try {
    let sql = "SELECT * FROM product WHERE id = ?";
    let [product, fileds] = await conn.query(sql, params);
    let sql2 =
      "SELECT * FROM review INNER JOIN product ON review.product_id = product.id INNER JOIN user ON review.user_id = user.id WHERE product.id = ?";
    let [review, fileds2] = await conn.query(sql2, params);
    let sql3 =
      "SELECT * FROM product WHERE group_product_id = (SELECT group_product_id FROM product WHERE id = ?) AND type_product_id = (SELECT type_product_id FROM product WHERE id = ?) AND id != ? ORDER BY RAND() LIMIT 4";
    let [relatedProducts, fields3] = await conn.query(sql3, [
      params,
      params,
      params,
    ]);

    res.render("user/Home/seeproduct", {
      product: product[0],
      review: review,
      relatedProducts: relatedProducts,
    });
  } catch (err) {}
});

//stripe
const stripe = require("stripe")(
  "sk_test_51NuaOYAHQOtBqpcVrCugTUgxi4RgL8Ja5kIdIP1Gs0v35WfEbWAIBZMcQ0sAe20qfmHyccLghZvzXYySjfXVlhcU00OaDi3xYV"
);
const DOMAIN = "https://ab8a-1-20-175-217.ngrok-free.app";
router.post("/stript-checkout/:id", async (req, res) => {
  let sql = "";
  sql += " SELECT orderdetail.*, product.name FROM orderdetail";
  sql += " LEFT JOIN product ON product.id = orderdetail.product_id";
  sql += " WHERE orderdetail.order_id = ?";
  sql += " ORDER BY orderdetail.id DESC";

  let params = [req.params.id];
  let totalQty = 0;
  let totalPrice = 0;

  conn.query(sql, params, async (err, result) => {
    if (err) throw err;
    const lineItems = result.map((item) => {
      const unitAmount = parseInt(item.price) * 100;

      totalQty += item.qty;
      totalPrice += item.qty * item.price;

      return {
        price_data: {
          currency: "THB",
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.qty,
      };
    });
    console.log("lineItems:", lineItems);
    // สร้าง checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${DOMAIN}/success?id=${req.params.id}`,
      cancel_url: `${DOMAIN}/cancel`,
      line_items: lineItems,
    });

    let status = session.status;
    let session_id = session.id;

    let data = "UPDATE `order` SET status = ?, session_id = ? WHERE id = ?";
    let params = [status, session_id, req.params.id];
    conn.query(data, params, (err, result) => {
      if (err) throw err;
    });
    res.redirect(303, session.url);
    // เรียกใช้งาน session.id เพื่อใช้ในการเปิด Stripe Checkout
    console.log("Stripe Checkout Session ID:", session.id);
    console.log("Session:", session);
  });
});

const endpointSecret = "whsec_4045aef67c82c687b4f0b46a183d94ae7985f0986f4b9ee9746c4b31ed50963a";

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let conn = require("./connect2");
    let event = req.body;

    switch (event.type) {
      case "checkout.session.completed":
        let paymentData = event.data.object;
        console.log("paymentData", paymentData);
        let session_id = paymentData.id;
        let status = paymentData.status;
        console.log("paymentstatus", status);

        let sql = 'UPDATE `order` SET pay_date = NOW(), status = ? WHERE session_id = ?';
        let [datas, result] = await conn.query(sql, [status, session_id]);
        console.log('===update result', datas);

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
  }
);

router.get("/success", (req, res) => {
  res.render("success");
});

module.exports = router;
