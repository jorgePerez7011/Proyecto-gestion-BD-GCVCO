const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const { sort = "id", order = "desc" } = req.query; 
    const orden = order === "asc" ? 1 : -1;
    const productos = await Product.find().sort({ [sort]: orden }); 
    
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const producto = await Product.findOne({ id: req.params.id }); 
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" }); 
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};