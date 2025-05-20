import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import axios from "axios";
import { Search, Plus, Trash2 } from "lucide-react";

const OrderGUI = () => {
  const [esSidebarAbierto, setEsSidebarAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenes, setOrdenes] = useState([]);
  const [orden, setOrden] = useState({
    route: "",
    client_id: "",
    client_name: "",
    total: 0
  });

  const alternarSidebar = () => setEsSidebarAbierto(!esSidebarAbierto);

  useEffect(() => {
    obtenerProductos();
    obtenerOrdenes();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const obtenerOrdenes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders");
      console.log("Órdenes recibidas:", res.data); // Para debug
      setOrdenes(res.data || []); // Ensure we always have an array
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      setOrdenes([]); // Set empty array on error
    }
  };

  const agregarProducto = (producto) => {
    const productoExistente = productosSeleccionados.find(p => p.id === producto.id);
    
    if (productoExistente) {
      setProductosSeleccionados(
        productosSeleccionados.map(p =>
          p.id === producto.id 
          ? {...p, cantidad: p.cantidad + 1}
          : p
        )
      );
    } else {
      setProductosSeleccionados([
        ...productosSeleccionados,
        { ...producto, cantidad: 1 }
      ]);
    }
    calcularTotal();
  };

  const eliminarProducto = (productoId) => {
    setProductosSeleccionados(
      productosSeleccionados.filter(p => p.id !== productoId)
    );
    calcularTotal();
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad > 0) {
      setProductosSeleccionados(
        productosSeleccionados.map(p =>
          p.id === productoId 
          ? {...p, cantidad: parseInt(nuevaCantidad)}
          : p
        )
      );
      calcularTotal();
    }
  };

  const calcularTotal = () => {
    const total = productosSeleccionados.reduce(
      (acc, producto) => acc + (producto.price * producto.cantidad),
      0
    );
    setOrden({...orden, total});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!productosSeleccionados || productosSeleccionados.length === 0) {
        alert('Debe seleccionar al menos un producto');
        return;
      }

      const orderData = {
        route: orden.route,
        client_id: orden.client_id,
        client_name: orden.client_name,
        total: orden.total,
        products: productosSeleccionados.map(p => ({
          product: p._id || p.id,
          quantity: p.cantidad,
          price: p.price,
          name: p.name // Agregamos el nombre del producto
        }))
      };
      
      await axios.post("http://localhost:5000/orders", orderData);
      setProductosSeleccionados([]);
      setOrden({ route: "", client_id: "", client_name: "", total: 0 });
      obtenerOrdenes();
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert('Error al crear la orden. Por favor, intente nuevamente.');
    }
  };

  const productosFiltrados = productos.filter(producto =>
    producto.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f5f6fa]">
      <Sidebar isSidebarOpen={esSidebarAbierto} toggleSidebar={alternarSidebar} />
      <div className="flex-1 overflow-auto">
        <Navbar />
        <h1 className="px-8 mx-1 text-2xl font-semibold">Crear Orden</h1>
        
        <div className="grid grid-cols-2 gap-4 mx-8 mt-4">
          {/* Lista de Productos */}
          <div className="bg-white p-4 rounded-sm shadow">
            <div className="flex items-center mb-4 gap-2">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full p-2 border rounded"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="border p-3 rounded">
                  <h3 className="font-semibold">{producto.name}</h3>
                  <p className="text-gray-600">${producto.price}</p>
                  <button
                    onClick={() => agregarProducto(producto)}
                    className="mt-2 flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario de Orden */}
          <div className="bg-white p-4 rounded-sm shadow">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ruta de entrega"
                className="w-full p-2 border rounded mb-3"
                value={orden.route}
                onChange={(e) => setOrden({...orden, route: e.target.value})}
                required
              />
              
              <input
                type="text"
                placeholder="ID del cliente"
                className="w-full p-2 border rounded mb-3"
                value={orden.client_id}
                onChange={(e) => setOrden({...orden, client_id: e.target.value})}
                required
              />
              
              <input
                type="text"
                placeholder="Nombre del cliente"
                className="w-full p-2 border rounded mb-3"
                value={orden.client_name}
                onChange={(e) => setOrden({...orden, client_name: e.target.value})}
                required
              />

              <div className="border rounded p-2 mb-3">
                <h3 className="font-semibold mb-2">Productos seleccionados</h3>
                {productosSeleccionados.map((producto) => (
                  <div key={producto.id} className="flex items-center justify-between mb-2">
                    <span>{producto.name}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={producto.cantidad}
                        onChange={(e) => actualizarCantidad(producto.id, e.target.value)}
                        className="w-16 p-1 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarProducto(producto.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right mb-3">
                <span className="font-semibold">Total: ${orden.total}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Crear Orden
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Órdenes */}
        <div className="mx-8 mt-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Órdenes Realizadas</h2>
          <div className="bg-white rounded-sm shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordenes && ordenes.map((orden) => (
                  <tr key={orden._id || orden.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {orden.client_name ? `${orden.client_name} (${orden.client_id})` : orden.client_id || 'Cliente no disponible'}
                    </td>
                    <td className="px-6 py-4">
                      <ul className="list-disc list-inside">
                        {orden.products && orden.products.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {item.name || (item.product && item.product.name) || 'Producto no disponible'} 
                            x {item.quantity} - ${item.price}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{orden.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${(orden.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {orden.created_at ? new Date(orden.created_at).toLocaleDateString() : 'Fecha no disponible'}
                    </td>
                  </tr>
                ))}
                {(!ordenes || ordenes.length === 0) && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No hay órdenes registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderGUI;