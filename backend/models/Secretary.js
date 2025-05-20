const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const secretarySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  secondLastName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  yearsOfExperience: { type: Number, required: true },
  hiringDate: { type: Date, default: Date.now },
  password: { type: String, required: true },
});

secretarySchema.index({ firstName: 1 }); 
secretarySchema.index({ middleName: 1 }); 
secretarySchema.index({ lastName: 1 }); 
secretarySchema.index({ secondLastName: 1 });
secretarySchema.index({ email: "text" });
secretarySchema.index({ phone: 1 }); 
secretarySchema.index({ yearsOfExperience: 1 });
secretarySchema.index({ hiringDate: 1 });
secretarySchema.index({ email: 1, phone: 1 });
secretarySchema.index({ yearsOfExperience: 1, hiringDate: -1 }); 

secretarySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

secretarySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Secretary = mongoose.model("Secretary", secretarySchema);

module.exports = Secretary;