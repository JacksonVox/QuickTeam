const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const { User, SubUser } = require('../models/User')

module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` })
      }
      if (!user.password) {
        return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' })
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err) }
        if (isMatch) {
          return done(null, user)
        }
        return done(null, false, { msg: 'Invalid email or password.' })
      })
    })
  }))
  

  passport.serializeUser((user, done) => {
    done(null, { id: user.id, type: user instanceof SubUser ? 'SubUser' : 'User' });
  });
  
  passport.deserializeUser((data, done) => {
    if (data.type === 'User') {
      User.findById(data.id, (err, user) => done(err, user));
    } else if (data.type === 'SubUser') {
      SubUser.findById(data.id, (err, subUser) => done(err, subUser));
    }
  });
}
