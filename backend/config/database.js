const mongoose = require("mongoose")
const dotenv = require("dotenv")
//dotenv
dotenv.config({path: "backend/config/config.env"});
//database Connection
const dataConnect = async () => {
   await mongoose.connect(process.env.URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("Database connnection successfully")
    }) 
}

module.exports = dataConnect