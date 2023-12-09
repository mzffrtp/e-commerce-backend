const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const DB = process.env.DATABASE.replace("<PASS>", process.env.DATABASE_PASS)

const db = () => {
    mongoose
        .connect(DB)
        .then(() => console.log("server connected"))
        .catch((err) => console.log("server not connected", err))
}

module.exports = db