const mongoose = require('mongoose');
const Order = new mongoose.Schema({
     CID: {
          type: String,
     },
     Products: [{
          product_Id: String,
          imagename: String,
          imageType: String,
          ArtName: String,
          Rprice: Number,
          Size: String,
          Medium: String,
          Surface: String,
          CreatedIn: Number,
          qty: Number,
     },],
     Status: {
          type: String
     },
     payment_id: {
          type: String
     },
     Quantity: {
          type: String,
     },
     date:
     {
          type: Date,
          default: Date.now
     }
});


const order = mongoose.model('orderDB', Order);
module.exports = order;

