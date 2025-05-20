const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  document: { type: String, required: true, unique: true },
  address: { type: String },
  city: { type: String },
  phone: { type: String },
  email: { type: String },
  registered_by: { type: String, default: "admin" },
  status: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

customerSchema.index({ firstName: 1 }); 
customerSchema.index({ lastName: 1 }); 
customerSchema.index({ city: 1 });
customerSchema.index({ phone: 1 }); 
customerSchema.index({ created_at: 1 });
customerSchema.index({ updated_at: 1 });
customerSchema.index({ city: 1, status: 1 }); 
customerSchema.index({ email: "text" });
customerSchema.index({ document: 1, phone: 1 });

module.exports = mongoose.model('Customer', customerSchema);