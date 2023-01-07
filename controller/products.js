const mongoose = require('mongoose')
const Product = require('../model/product')

const getAllProducts = async (req, res, next) => {
  try {
    const docs = await Product.find({}).select('name price _id productImage')
    const response = {
      coun: docs.length,
      products: docs.map((doc) => {
        return {
          name: doc.name,
          price: doc.price,
          productImage: `http://localhost:3000/${doc.productImage} `,
          _id: doc._id,
          requist: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + doc._id,
          },
        }
      }),
    }
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

const createNewProduct = async (req, res, next) => {
  console.log(req.file)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  })
  try {
    await product.save()
    res.status(201).json({
      message: 'product saved!',
      createdProduct: {
        name: product.name,
        price: product.price,
        _id: product._id,
        requist: {
          type: 'POST',
          url: 'http://localhost:3000/products/' + product._id,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

const getProduct = async (req, res, next) => {
  const id = req.params.productId
  try {
    const product = await Product.findById(id).select('name price _id')
    if (product != null) {
      res.status(200).json({
        product: product,
        requist: {
          type: 'GET',
          url: 'http://localhost:3000/products',
        },
      })
    } else {
      const error = new Error('Product not found')
      error.status = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
}

const updateProduct = (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.updateOne({ _id: id }, updateOps)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product updated!',
        requist: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id,
        },
      })
    })
    .catch((error) => {
      next(error)
    })
}

const deleteProduct = async (req, res, next) => {
  const id = req.params.productId
  try {
    await Product.deleteOne({ _id: id })
    res.status(200).json({
      message: 'Product deleted!',
      requist: {
        type: 'POST',
        url: 'http://localhost:3000/products',
        body: {
          name: 'String',
          price: 'Number',
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllProducts,
  createNewProduct,
  getProduct,
  updateProduct,
  deleteProduct,
}
