const mongoose = require('mongoose')
const Order = require('../model/order')
const Product = require('../model/product')

const getAllOrders = (req, res, next) => {
  Order.find({})
    .select('product quantity _id')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            requist: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id,
            },
          }
        }),
      })
    })
    .catch((err) => {
      next(err)
    })
}

const createNewOrder = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      })

      return order.save()
    })
    .then((result) => {
      res.status(200).json({
        message: 'Order stored!',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        requist: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id,
        },
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getOrder = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        })
      }
      res.status(200).json({
        order,
        requist: {
          type: 'GET',
          url: 'http://localhost:3000/orders',
        },
      })
    })
    .catch((err) => {
      next(err)
    })
}

const deleteOrder = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Order deleted!',
        requist: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
        },
        body: {
          productId: 'ID',
          quantity: 'Number',
        },
      })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports = {
  getAllOrders,
  createNewOrder,
  getOrder,
  deleteOrder,
}
