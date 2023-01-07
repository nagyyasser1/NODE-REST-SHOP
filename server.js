const http = require('http')
const app = require('./app')
const port = process.env.port || 3000

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const dotenv = require('dotenv')
dotenv.config()

const server = http.createServer(app)

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    server.listen(port, () => {
      console.log(
        `server runing... on port ${port} go to http://localhost:${port}`,
      )
    })
  })
  .catch((err) => {
    console.log(err)
  })
