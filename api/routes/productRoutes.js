const {
    allProducts,
    createProduct,
    deleteProduct,
    detailProducts,
    updateProduct,
    createReview,
    adminProducts
} = require("../controllers/productController");

const express = require("express");

const productRouter = express.Router()

productRouter.get("/products", allProducts);
productRouter.get("/admin/products", adminProducts);

productRouter.get("/products/:id", detailProducts);
productRouter.post("/product/new", createProduct);
productRouter.post("/product/newReview", createReview);
productRouter.put("/product/:id", updateProduct);
productRouter.delete("/product/:id", deleteProduct);

module.exports = productRouter