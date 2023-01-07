const express = require('express')
const router = express.Router()

const {
  getAllOrders,
  createNewOrder,
  getOrder,
  deleteOrder,
} = require('../controller/orders')

const checkAuth = require('../middlewares/check-auth')

router.get('/', checkAuth, getAllOrders)
router.post('/', checkAuth, createNewOrder)
router.get('/:orderId', checkAuth, getOrder)
router.delete('/:orderId', checkAuth, deleteOrder)

module.exports = router
