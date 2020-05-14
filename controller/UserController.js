const User = require('../models/user')
const passport = require('passport')

module.exports = {
  async index (req, res) {
    try {
      if (req.session.cookie.originalMaxAge != null) {
        await res.redirect('/home')
      }
      await res.render('index', {
        title: 'Index' || 'RateMe'
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render index page'
      })
    }
  },

  async home (req, res) {
    try {
      console.log(req.user)
      await res.render('home', {
        title: 'Home' || 'Rate Me',
        user: req.user
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render home page'
      })
    }
  },

  async signup (req, res) {
    const error = req.flash('error')
    try {
      await res.render('user/signup', {
        title: 'Sign Up' || 'RateMe',
        message: error,
        hasError: error.length > 0
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render signup page'
      })
    }
  },

  async login (req, res) {
    const error = req.flash('error')
    try {
      await res.render('user/login', {
        title: 'Login' || 'RateMe',
        message: error,
        hasError: error.length > 0
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render login page'
      })
    }
  },

  async forgot (req, res) {
    const error = req.flash('error')
    const info = req.flash('info')
    try {
      await res.render('user/forgot', {
        title: 'Request Password Reset',
        info,
        noErrors: info.length > 0,
        messages: error,
        hasErrors: error.length > 0
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render forgot page'
      })
    }
  },

  async reset (req, res) {
    try {
      const user = await User.findOne({
        passwordResetToken: req.params.token,
        passwordResetExpires: { $gt: Date.now() }
      })
      if (!user) {
        req.flash('error', 'Password reset token has Expired or invalid')
        return res.redirect('/forgot')
      }
      const error = req.flash('error')
      const success = req.flash('success')
      await res.render('user/reset', {
        title: 'Reset Your Password',
        messages: error,
        hasErrors: error.length > 0,
        noErrors: success.length > 0,
        success
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render reset page'
      })
    }
  }
}
