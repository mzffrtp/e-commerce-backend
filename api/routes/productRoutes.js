const {
    allProducts,
    createProduct,
    deleteProduct,
    detailProducts,
    updateProduct,
    createReview,
    adminProducts
} = require("../controllers/productController");
const { authMid, roleChecked } = require("../middlewares/auth");


const express = require("express");

const productRouter = express.Router()

productRouter.get("/products", allProducts);
productRouter.get("/admin/products", authMid, roleChecked("admin"), adminProducts);

productRouter.get("/products/:id", detailProducts);
productRouter.post("/product/new", authMid, roleChecked("admin"), createProduct);
productRouter.post("/product/newReview", authMid, createReview);
productRouter.put("/product/:id", authMid, roleChecked("admin"), updateProduct);
productRouter.delete("/product/:id", authMid, roleChecked("admin"), deleteProduct);

module.exports = productRouter