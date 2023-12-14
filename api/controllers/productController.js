const Product = require("../models/productModel.js");
const ProductFilter = require("../utils/productFilter.js")
const cloudinary = require('cloudinary').v2;


exports.allProducts = async (req, res) => {
    const resultPerPage = 10;
    const productFilter = new ProductFilter(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)

    const products = await productFilter.query

    res.status(200).json({
        message: "all products",
        nProducts: products.length,
        products
    })
};

exports.detailProducts = async (req, res) => {
    const productDetail = await Product.findById(req.params.id);

    res.status(200).json({
        message: "product detail",
        productDetail
    })
};

exports.createProduct = async (req, res, next) => {

    //! adding product images to cloud
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let allImage = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products"
        })

        allImage.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = allImage
    req.body.user = req.user.id

    const newProduct = await Product.create(req.body);

    res.status(201).json({
        message: " new product",
        newProduct
    })
};

exports.deleteProduct = async (req, res, next) => {
    const deletedProduct = await Product.findById(req.params.id);

    //! deleting images form cloud
    for (let i = 0; i < deletedProduct.length; i++) {
        await cloudinary.uploader.destroy(deletedProduct.images[i].public_id)
    }

    //! after deleting images form cloud, delete product
    await deletedProduct.remove();

    res.status(200).json({
        message: "product deleted successfuly",
    })
};

exports.updateProduct = async (req, res, next) => {

    //! updating product images to cloud
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {
        //! deleting images form cloud
        for (let i = 0; i < deletedProduct.length; i++) {
            await cloudinary.uploader.destroy(deletedProduct.images[i].public_id)
        }
    }

    let allImage = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products"
        })

        allImage.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = allImage

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
        message: "product updated",
        updatedProduct
    })
};

exports.createReview = async (req, res, next) => {
    const { productId, comment, rating, } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);
    product.reviews.push(review)

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating
    })

    product.rating = avg / product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        message: "Review added!"
    })
}

exports.adminProducts = async (req, res, next) => {
    const products = await Product.find()

    res.status(200).json({
        message: "all products",
        nProduct: products.length,
        products,
    })
}