const express = require("express")
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const db = require("./config/db");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const cloudinary = require('cloudinary').v2;

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
});

const app = express();

//! middleware
app.use(morgan("dev"))

//! security
app.use(cors())
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cookieParser())

//! routes
app.use("/", productRouter)
app.use("/", userRouter)


//!database
db();

//!Global error management
app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || "Soory, something went wrong!"

    return res.status(errStatus).json({
        statusCode: errStatus,
        message: errMessage
    });
});
const PORT = 5173;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})