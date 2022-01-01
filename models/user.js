const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      unique: true
   }
})

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model('User', userSchema);

module.exports = user;