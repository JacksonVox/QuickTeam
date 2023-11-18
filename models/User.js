const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: false },
  email: { type: String, unique: true },
  password: String,
  adminId: { type: String, unique: false },
  isAdmin: Boolean
})

const SubUserSchema = new mongoose.Schema({
  userName: { type: String, unique: false },
  passKey: { type: String, unique: true },
  adminId: { type: String, unique: false },
  isAdmin: Boolean
})


// Password hash middleware.
 
UserSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      if (!user.adminId) {
        user.adminId = user._id; // Set adminId
      }
      next()
    })
  })
})

//Set adminId on SubUser middleware.
SubUserSchema.pre('save', function save(next) {
  const user = this
      if (!user.adminId) {
        user.adminId = user._id; // Set adminId
      }
      next()
})


// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}




const User = mongoose.model('User', UserSchema);
const SubUser = mongoose.model('SubUser', SubUserSchema);

module.exports = { User, SubUser };
