const Customer = require("../models/Customer");

exports.getAllCustomers = async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
};

exports.getCustomerById = async (req, res) => {
  const customer = await Customer.findOne({ id: req.params.id });
  if (!customer)
    return res.status(404).json({ message: "Cliente no encontrado" });
  res.json(customer);
};

exports.createCustomer = async (req, res) => {
  const lastCustomer = await Customer.findOne().sort({ id: -1 });
  const newId = lastCustomer ? lastCustomer.id + 1 : 1;

  const newCustomer = new Customer({
    id: newId,
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  });

  await newCustomer.save();
  res.status(201).json(newCustomer);
};

exports.updateCustomer = async (req, res) => {
  const updated = await Customer.findOneAndUpdate(
    { id: req.params.id },
    { ...req.body, updated_at: new Date() },
    { new: true }
  );
  if (!updated)
    return res.status(404).json({ message: "Cliente no encontrado" });
  res.json(updated);
};

exports.deleteCustomer = async (req, res) => {
  const deleted = await Customer.findOneAndDelete({ id: req.params.id });
  if (!deleted)
    return res.status(404).json({ message: "Cliente no encontrado" });
  res.json({ message: "Cliente eliminado correctamente" });
};

exports.getCustomerByDocument = async (req, res) => {
  try {
    const { document } = req.params;
    const customer = await Customer.findOne({ document });
    if (!customer) return res.status(404).json({ message: "No encontrado" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};