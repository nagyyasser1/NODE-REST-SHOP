const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/user')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Handling Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  )
  if (req.method === 'OPTHIONS') {
    res.header('Access-Control-Methods', 'PUT,POST,PATCH,DELETE,GET')
    res.status(200).json({})
  }
  next()
})

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use('/uploads', express.static('uploads'))

// Routes should handle requests
app.get('/', (req, res) => {
  res.render('index')
})
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

// Handling errors of bad routes

app.use('*', (req, res, next) => {
  const error = new Error('Not Found!')
  error.status = 404
  next(error)
})

// handling any error in our server

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
