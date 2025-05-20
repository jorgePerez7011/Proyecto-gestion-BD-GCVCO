import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import CustomerModal from "../components/CustumerModal";
import CustomerSearchModal from "../components/CustomerSearchModal";
import RegisterCustomer from "../components/RegisterCustomer";
import {Boxes,Users,TrendingUp,BarChart2} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventasDiarias, setVentaDiaria] = useState([]);
  const [ventasMensuales, setVentaMensual] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerClientes();
    obtenerProductos();
    obtenerVentasDiarias();
    obtenerVentasMensuales();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/customers");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const obtenerVentasDiarias = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders/sales/daily");
      setVentaDiaria(res.data.total); 
    } catch (error) {
      console.error("Error al obtener ventas diarias:", error);
    }
  };

  const obtenerVentasMensuales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders/sales/monthly");
      setVentaMensual(res.data.total);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteSeleccionado({ ...clienteSeleccionado, [name]: value });
  };

  const handleUpdateCustomer = async () => {
    try {
      await axios.put(
        `http://localhost:5000/customers/${clienteSeleccionado.id}`,
        clienteSeleccionado
      );
      obtenerClientes();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/customers/${clienteSeleccionado.id}`
      );
      obtenerClientes();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const handleCloseModal = () => {
    setClienteSeleccionado(null);
    setMostrarFormulario(false);
  };

  const handleSearchCustomer = async (documento) => {
    try {
      console.log("Buscando cliente con documento:", documento);

      const res = await axios.get(
        `http://localhost:5000/customers/document/${documento}`
      );

      console.log("Respuesta del servidor:", res.data);

      if (res.data && Object.keys(res.data).length > 0) {
        setClienteSeleccionado(res.data);
        setMostrarFormulario(true);
        setMostrarBuscador(false); 
      } else {
        Swal.fire({
          icon: "error",
          title: "Cliente no encontrado",
          text: "No se encontró ningún cliente con ese documento.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Cliente no encontrado",
        text: "No se encontró ningún cliente con ese documento.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleRegisterClient = () => {
    setShowRegisterModal(true);
  };

  const closeModal = () => {
    setShowRegisterModal(false);
  };


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-auto">
        <Navbar />
        <span className="px-8 mx-1 text-2xl font-semibold">Dashboard</span>
        <div className="flex gap-6 items-stretch px-8 py-4">
          <div className="bg-[#0dcaf0] text-white flex-1 p-6 rounded-sm shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Boxes size={20} />
              <span>Productos</span>
            </h3>
            <p className="text-4xl font-bold text-center">
              {productos.length}
            </p>
            <p className="text-center text-lg">Productos registrados</p>
            
            <button onClick={() => navigate("/product")} className="mt-2 w-full bg-blue-500 text-white py-1 px-1 rounded-sm hover:bg-blue-600">
              Ver mas
            </button>
          </div>

          <div className="bg-[#188754] flex-1 p-6 rounded-sm text-white shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Users size={20} />
              <span>Clientes</span>
            </h3>
            <p className="text-4xl font-bold text-center text">
              {clientes.length}
            </p>
            <p className="text-center">Clientes registrados</p>

            <button onClick={() => setMostrarBuscador(true)}className="mt-2 w-full bg-green-500 text-white py-1 px-1 rounded-sm hover:bg-green-600">
              Buscar
            </button>

            <button onClick={handleRegisterClient}className="mt-2 w-full bg-green-500 text-white py-1 px-1 rounded-sm hover:bg-green-600">
              Registrar cliente
            </button>
          </div>

          <div className="bg-[#fec107] flex-1 p-6 rounded-sm text-white shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Ventas diarias</span>
            </h3>
            <p className="text-4xl font-bold text-center text">
              {ventasDiarias} $
            </p>
          </div>

          <div className="bg-[#dc3546] flex-1 p-6 rounded-sm text-white shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <BarChart2 size={20} />
              <span>Ventas mensuales</span>
            </h3>
            <p className="text-4xl font-bold text-center text">
              {ventasMensuales} $
            </p>
          </div>
        </div>
      </div>

      {mostrarFormulario && clienteSeleccionado && (
        <CustomerModal
          cliente={clienteSeleccionado}
          onChange={handleInputChange}
          onSave={handleUpdateCustomer}
          onDelete={handleDeleteCustomer}
          onClose={handleCloseModal}
        />
      )}

      {mostrarBuscador && (
        <CustomerSearchModal
          onSearch={handleSearchCustomer}
          onClose={() => setMostrarBuscador(false)}
        />
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-sm shadow-xl relative w-full max-w-lg">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"onClick={closeModal}>
              ✖
            </button>
            <RegisterCustomer />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;