const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  id: {type: Number,required: true,unique: true,index: true},
  name: {type: String,required: true,trim: true,maxlength: 100},
  image: {type: String},
  description: {type: String,required: true,maxlength: [500]},
  registered_by: {type: String,default: "admin"},
  status: {type: String,required: true,enum: ["activo", "inactivo"]},
  price: {type: Number,required: true,min: 0},
  quantity: {type: Number,required: true,min: 0},
  provider_id: {type: Number,required: true},
  created_at: {type: Date,default: Date.now},
  updated_at: {type: Date,default: Date.now},
  category_id: {type: Number,required: true},
});

productSchema.index({ status: 1 });
productSchema.index({ provider_id: 1 });
productSchema.index({ category_id: 1 });
productSchema.index({ created_at: 1 });
productSchema.index({ status: 1, category_id: 1 });  
productSchema.index({ price: 1 });  
productSchema.index({ quantity: 1 }); 

productSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);