const Order = require("../models/Order");
const mongoose = require("mongoose");

exports.getAllOrders = async (req, res) => {
  try {
    const ordenes = await Order.aggregate([
      // Ordenar por total (de mayor a menor)
      { $sort: { total: -1 } },

      // Desenrollar el array de productos
      { $unwind: "$products" },

      // Hacer lookup con la colección de productos usando el ID numérico
      {
        $lookup: {
          from: "products",
          let: { productId: "$products.product" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: "$id" }, "$$productId"] }
              }
            }
          ],
          as: "productDetails"
        }
      },

      // Reagrupar los resultados por orden
      {
        $group: {
          _id: "$_id",
          id: { $first: "$id" },
          route: { $first: "$route" },
          client_id: { $first: "$client_id" },
          client_name: { $first: "$client_name" },
          total: { $first: "$total" },
          created_at: { $first: "$created_at" },
          date_order: { $first: "$date_order" },
          products: {
            $push: {
              product: "$products.product",
              name: "$products.name",
              quantity: "$products.quantity",
              price: "$products.price",
              productDetails: { $arrayElemAt: ["$productDetails", 0] }
            }
          }
        }
      }
    ]);
    
    res.status(200).json(ordenes);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ message: "Error al obtener las órdenes", error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Debug

    if (!req.body.products || !Array.isArray(req.body.products) || req.body.products.length === 0) {
      return res.status(400).json({ message: "Se requiere al menos un producto" });
    }

    // Obtener el último ID
    const lastOrder = await Order.findOne().sort({ id: -1 });
    const newId = lastOrder ? lastOrder.id + 1 : 1;

    // Formatear los productos y validar datos
    const products = req.body.products.map(p => {
      if (!p.product || !p.name || !p.quantity || !p.price) {
        throw new Error("Datos de producto incompletos");
      }
      return {
        product: p.product,
        name: p.name,
        quantity: Number(p.quantity),
        price: Number(p.price)
      };
    });

    // Calcular el total sumando precio * cantidad de cada producto
    const total = products.reduce((sum, product) => {
      const subtotal = product.price * product.quantity;
      console.log(`Subtotal para ${product.name}: ${subtotal}`); // Debug
      return sum + subtotal;
    }, 0);

    console.log('Total calculado:', total); // Debug

    const orderData = {
      id: newId,
      client_id: req.body.client_id,
      client_name: req.body.client_name,
      route: req.body.route,
      total: total,
      products: products,
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