const mongoose = require('mongoose')

var User = mongoose.model('User', {
  email: {
    type: String,
    require: true,
    minlength: 5,
    trim: true
  }
})

module.exports = { User }
