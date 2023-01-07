const User = require('../model/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleSignUp = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Mail Exists',
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: err,
            })
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            })
            user
              .save()
              .then((result) => {
                console.log(result)
                res.status(201).json({
                  message: 'User Created !',
                })
              })
              .catch((err) => {
                console.log(err)
                res.status(500).json({
                  error: err,
                })
              })
          }
        })
      }
    })
}

const handleLogin = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({
          message: 'Auth faild!',
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h',
            },
          )
          res.status(200).json({
            message: 'Auth successed ',
            token: token,
          })
        } else {
          res.status(401).json({
            message: 'Auth faild!',
          })
        }

        if (err) {
          res.status(401).json({
            message: 'Auth faild!',
          })
        }
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      })
    })
}

const handleDeleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'User deleted ',
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
}

module.exports = {
  handleSignUp,
  handleLogin,
  handleDeleteUser,
}
