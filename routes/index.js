const express = require('express')

const AuthController = require('../controller/AuthController')
const UserController = require('../controller/UserController')
const forgot = require('./forgot')
const reset = require('./reset')
const requireAuth = require('../policies/IsAuthenticated')

module.exports = function (app) {
  const api = express.Router()
  // routes render page our applicationa
  app.get('/', UserController.index)
  app.get('/home', UserController.home)
  app.get('/forgot', UserController.forgot)
  app.get('/reset/:token', UserController.reset)
  // routes
  app.get('/signup', UserController.signup)
  app.get('/login', UserController.login)
  app.post('/signup', validate, AuthController.signup)
  app.post('/login', loginValidate, AuthController.login)
  app.post('/forgot', forgot)
  app.post('/reset/:token', reset)

  api.get('/test', (req, res) => {
    res.render('test')
  })
  app.use('/api', api)
}

function validate (req, res, next) {
  req.checkBody('fullname', 'Fullname is Required !').notEmpty()
  req.checkBody('fullname', 'Fullname must not be less than 5 !').isLength({ min: 5 })
  req.checkBody('email', 'Email is Required !').notEmpty()
  req.checkBody('email', 'Email is Invalid !').isEmail()
  req.checkBody('password', 'Password is Required !').notEmpty()
  req.checkBody('password', 'Password must not be less than 5 !').isLength({ min: 5 })
  // req.check('password', 'Password must contain at least 1 number.').matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, 'i')

  var errors = req.validationErrors()
  if (errors) {
    var messages = []
    errors.forEach((error) => {
      messages.push(error.msg)
    })

    req.flash('error', messages)
    res.redirect('/signup')
  } else {
    return next()
  }
}

function loginValidate (req, res, next) {
  req.checkBody('email', 'Email is Required !').notEmpty()
  req.checkBody('email', 'Email is Invalid !').isEmail()
  req.checkBody('password', 'Password is Required !').notEmpty()
  req.checkBody('password', 'Password must not be less than 5 !').isLength({ min: 5 })
  // req.check('password', 'Password must contain at least 1 number.').matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, 'i')
  req.getValidationResult()
    .then((result) => {
      if (result.array().length > 0) {
        console.log('error')
        var messages = []
        result.array().forEach((error) => {
          messages.push(error.msg)
        })
        req.flash('error', messages)
        res.redirect('/login')
      } else {
        return next()
      }
    })
}
