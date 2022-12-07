const mongoose = require('mongoose');
const bc = require('bcryptjs');
const p_register = new mongoose.Schema({
     Profile: {
          type: String,
     },

     FirstName: {
          type: String,
          required: true
     },

     LastName: {
          type: String,
          required: true
     },
     Address: {
          type: String,
          required: true
     },
     Email: {
          type: String,
          required: true,
          index: {
               unique: true,
          }
     },
     Password: {
          type: String,
          required: true,
          index: {
               unique: true,
          }
     },
     Country: {
          type: String,
          required: true
     },
     Pincode: {
          type: String,
          required: true
     },
     PhoneNumber: {
          type: String,
          required: true
     },

     date:
     {
          type: Date,
          default: Date.now
     }
});

p_register.pre('save', async function (next) {
     if (this.isModified('Password')) {
          this.Password = bc.hashSync(this.Password, 12);
     }
     next();
})


const painter = mongoose.model('paccount', p_register);
module.exports = painter;

