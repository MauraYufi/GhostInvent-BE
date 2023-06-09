const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Balance = require("../models/balanceModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose');

// Create Prouct
const createProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, desc, image } = req.body;

  //   Validation
  if (!name || !category || !quantity || !price || !desc) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  try {
    const newProduct = await Product.create({
      user: req.user.id,
      name,
      category,
      quantity,
      price,
      desc,
      image,
    });
    const balance = await Balance.findById("647c36f043150933c53950b5");

    if (!balance) {
      console.log("Saldo tidak ditemukan");
      return;
    }

    const updatedBalance = parseInt(balance.balance) - (parseInt(price) * parseInt(quantity));

    // Mengupdate data saldo dengan nilai yang telah dikurangi
    balance.balance = updatedBalance;
    await balance.save();

    console.log("Saldo berhasil diperbarui:", balance);
    console.log("test")

    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error, please try again");
  }

  res.status(201).json(product);
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// Get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await product.remove();
  res.status(200).json({ message: "Product deleted." });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  const quantitybefore = parseInt(product.quantity);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  const balance = await Balance.findById("647c36f043150933c53950b5");

    if (!balance) {
      console.log("Saldo tidak ditemukan");
      return;
    }
    let difference = parseInt(quantity) - quantitybefore;

    if(difference>0){
      const updatedBalance = parseInt(balance.balance) - (parseInt(price) * difference);
      // Mengupdate data saldo dengan nilai yang telah dikurangi
      balance.balance = updatedBalance;
      await balance.save();
    }
    
    console.log("Saldo berhasil diperbarui:", balance);
    console.log("test")

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
