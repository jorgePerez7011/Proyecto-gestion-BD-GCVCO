const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const secretaryRoutes = require("./routes/SecretaryRoutes");
const customerRoutes = require("./routes/CustomerRoutes"); 
const productRoutes = require("./routes/ProductRoutes"); 
const orderRoutes = require("./routes/OrderRoutes")

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar con MongoDB:", err));

app.use("/auth", secretaryRoutes);
app.use("/customers", customerRoutes); 
app.use("/products",productRoutes)
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});