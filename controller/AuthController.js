const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const passport = require('passport')

function jwtUser ({ id }) {
  // id is a payload plain js
  return jwt.sign({ id }, config.authentications.secret, {
    expiresIn: 1440 // expires in 24 hours
  })
}

module.exports = {
  async signup (req, res) {
    try {
      const usrExst = await User.findOne({ email: req.email })
      if (usrExst) {
        return req.flash('error', 'email is already exist')
      }
      const newUser = new User()
      newUser.fullname = req.body.fullname
      newUser.email = req.body.email
      newUser.password = newUser.encryptPassword(req.body.password)

      const user = await newUser.save()
      if (!user) {
        return res.status(500).send({
          message: 'does not signup user! :('
        })
      }
      res.status(200).redirect('/')
    } catch (error) {
      res.status(500).send({
        message: 'signup user has failed! :('
      })
    }
  },

  async logout (req, res) {
    try {
      req.logout()
      req.session.destroy((err) => {
        if (err) {
          return res.send(err)
        }
        res.redirect('/')
      })
    } catch (error) {
      res.status(500).send({
        error,
        message: 'does not logout'
      })
    }
  }
}
