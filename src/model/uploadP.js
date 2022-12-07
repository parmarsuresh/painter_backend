const mongoose = require('mongoose');
const uploadP = new mongoose.Schema({
     Profile: {
          type: String,
     },
     Imgtype: {
          type: String,
          required: true
     },

     Artname: {
          type: String,
          required: true
     },
     Rprice: {
          type: Number,
          required: true
     },
     Dprice: {
          type: Number,
          required: true,
     },
     Size: {
          type: String,
          required: true,
     },
     Medium: {
          type: String,
          required: true
     },
     Surface: {
          type: String,
          required: true
     },
     Year: {
          type: Number,
          required: true
     },
     PID: {
          type: String,
     },
     date:
     {
          type: Date,
          default: Date.now
     }
});


const uploadModel = mongoose.model('uploadimage', uploadP);
module.exports = uploadModel;

