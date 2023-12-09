const express = require("express")
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const db = require("./config/db");

dotenv.config();

const app = express();

//! middleware
app.use(morgan("dev"))

//! security
app.use(cors())
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cookieParser())

//!database
db();

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})