const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

router.get("/", orderController.getAllOrders);
router.post("/", orderController.createOrder);
router.get('/sales/daily', orderController.getDailySales);
router.get('/sales/monthly', orderController.getMonthlySales);

module.exports = router;