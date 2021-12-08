const app = require("./app")
//const dotenv = require("dotenv")
const cloudinary = require("cloudinary")
const connect = require("./config/database")

//Handling uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`shutting down the server due to uncaught Exception`)
    process.exit(1)
})


// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
  }
//database Connection
connect();
//cloudinary connection
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
 
//PORT
const server = app.listen(process.env.PORT, () => {
    console.log(`connection successfully on PORT: ${process.env.PORT}`)
})

//unhandle promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandle promise rejection`);
    server.close(() => {
        process.exit(1);
    })
})