const express = require('express')
const router = express.Router()

const {
  getAllProducts,
  createNewProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/products')

const uploadProductImage = require('../middlewares/uploadProductImage')
const checkAuth = require('../middlewares/check-auth')

router.get('/', getAllProducts)
router.post('/', checkAuth, uploadProductImage, createNewProduct)
router.get('/:productId', getProduct)
router.patch('/:productId', checkAuth, updateProduct)
router.delete('/:productId', checkAuth, deleteProduct)

module.exports = router
