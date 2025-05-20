import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";

const ProductGUI = () => {
  const [productos, setProductos] = useState([]);
  const [esSidebarAbierto, setEsSidebarAbierto] = useState(false);
  const [campoOrden, setCampoOrden] = useState("id"); 
  const [orden, setOrden] = useState("asc"); 

  const alternarSidebar = () => setEsSidebarAbierto(!esSidebarAbierto);

  const obtenerProductos = useCallback(async (campo = campoOrden, ordenActual = orden) => {
    try {
      const respuesta = await fetch(
        `http://localhost:5000/products?sort=${campo}&order=${ordenActual}`
      );
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, [campoOrden, orden]);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  const manejarOrden = (campo) => {
    if (campoOrden === campo) {
      setOrden(orden === "asc" ? "desc" : "asc");
    } else {
      setCampoOrden(campo);
      setOrden("asc"); 
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f6fa]">
      <Sidebar isSidebarOpen={esSidebarAbierto} toggleSidebar={alternarSidebar} />
      <div className="flex-1 overflow-auto">
        <Navbar />

        <h1 className="px-8 mx-1 text-2xl font-semibold">Productos</h1>
        <div className="mx-auto px-8 py-4">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-gray-200"onClick={() => manejarOrden("id")}>
                  ID {campoOrden === "id" ? (orden === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-2 border border-gray-300">Nombre</th>
                <th className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-gray-200"onClick={() => manejarOrden("price")}>
                  Precio {campoOrden === "price" ? (orden === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-gray-200"onClick={() => manejarOrden("quantity")}>
                  Cantidad {campoOrden === "quantity" ? (orden === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-gray-200"onClick={() => manejarOrden("status")}>
                  Estado {campoOrden === "status" ? (orden === "asc" ? "↑" : "↓") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300">
                    {producto.id}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {producto.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${producto.price}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {producto.quantity}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {producto.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductGUI;