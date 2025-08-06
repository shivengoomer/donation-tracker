const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default :false,
  },
  email:{
    type : String,
    require:true,
    unique:true,
  }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
