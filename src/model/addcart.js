const mongoose = require('mongoose');
const addSchema = new mongoose.Schema({
     CID: {
          type: String
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
     }],

     date:
     {
          type: Date,
          default: Date.now
     }
});

const addcarttable = mongoose.model('addcart', addSchema);
module.exports = addcarttable;
