const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: {type: Number,required: [true, "El ID es obligatorio"],unique: true,index: true},
  date_order: { type: Date },
  route: { type: String, required: true },
  total: { type: Number, required: true },
  registered_by: { type: String, default: "admin" },
  status: {type: String,enum: ["Pendiente", "En camino", "Entregado", "Cancelado"],default: "Pendiente",index: true},
  client_id: { type: String, required: true },
  client_name: { type: String, required: true },
  products: [{
    product: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

orderSchema.pre("save", function (next) {
  if (!this.date_order) {
    this.date_order = this.created_at || new Date();
  }
  this.updated_at = new Date();
  next();
});

orderSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: new Date() });
  next();
});

orderSchema.index({ client_id: 1, date_order: -1 });
orderSchema.index({ status: 1, date_order: -1 });

module.exports = mongoose.model("Order", orderSchema);