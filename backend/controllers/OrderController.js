const Order = require("../models/Order");

exports.getAllOrders = async (req, res) => {
  try {
    const ordenes = await Order.find()
      .populate('products.product', 'name price')
      .sort({ created_at: -1 })
      .lean(); // Convertir a objeto plano de JavaScript
    
    // Asegurarse de que los productos tengan la información correcta
    const ordenesFormateadas = ordenes.map(orden => ({
      ...orden,
      products: orden.products.map(item => ({
        ...item,
        name: item.product ? item.product.name : item.name,
        price: item.price
      }))
    }));
    
    res.status(200).json(ordenesFormateadas);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ message: "Error al obtener las órdenes", error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    // Obtener el último ID
    const lastOrder = await Order.findOne().sort({ id: -1 });
    const newId = lastOrder ? lastOrder.id + 1 : 1;

    const orderData = {
      id: newId,
      client_id: req.body.client_id,
      client_name: req.body.client_name,
      route: req.body.route,
      total: req.body.total,
      products: req.body.products,
      date_order: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };

    const newOrder = new Order(orderData);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ message: "Error al crear la orden", error: error.message });
  }
};

// Función para obtener ventas diarias
exports.getDailySales = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const ventasDiarias = await Order.aggregate([
      { $match: { date_order: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, totalVentas: { $sum: "$total" } } },
    ]);

    const totalVentas = ventasDiarias.length > 0 ? ventasDiarias[0].totalVentas : 0;

    res.json({ total: totalVentas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Función para obtener ventas mensuales
exports.getMonthlySales = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Primer día del mes
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999); // Último día del mes

    const ventasMensuales = await Order.aggregate([
      { $match: { date_order: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, totalVentas: { $sum: '$total' } } }
    ]);

    const totalVentas = ventasMensuales.length > 0 ? ventasMensuales[0].totalVentas : 0;

    res.json({ total: totalVentas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};