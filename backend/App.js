const express = require ("express");
const app = express();
const errorMiddleWare = require("./middleWare/error")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")
//import Router
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order  = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute")

//.env config
dotenv.config({path: "backend/config/config.env"});

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

app.use("/", product)
app.use("/", user)
app.use("/", order)
app.use("/", payment)

//middleWare for error
app.use(errorMiddleWare)

module.exports = app