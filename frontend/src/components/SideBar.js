import { FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LogOut, Bot, FileText } from "lucide-react";
import Swal from "sweetalert2";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará y volverás al inicio.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/");
      }
    });
  };

  return (
    <div className={`${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out bg-[#353d46] text-white p-4 space-y-6`}>
      <div className="flex items-center mb-6">
        {isSidebarOpen ? (
          <>
            <h1 className="text-xl font-bold flex-1">Dashboard</h1>
            <FaBars onClick={toggleSidebar}className="text-white cursor-pointer"size={20}/>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <FaBars onClick={toggleSidebar}className="text-white cursor-pointer"size={20}/>
          </div>
        )}
      </div>

      <ul className="space-y-2">
        <li>
          <button onClick={() => navigate("/dashboard")}className={`flex ${isSidebarOpen? "flex-row justify-start space-x-3": "flex-col items-center"} w-full p-2 rounded-md transition-colors ${isActive("/dashboard") ? "bg-gray-800" : "hover:bg-gray-800"}`}>
            <Home size={24} />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Inicio
            </span>
          </button>
        </li>

        <li>
          <button onClick={() => navigate("/chatbot")}className={`flex ${isSidebarOpen? "flex-row justify-start space-x-3": "flex-col items-center"} w-full p-2 rounded-md transition-colors ${isActive("/chatbot") ? "bg-gray-800" : "hover:bg-gray-800"}`}>
            <Bot size={24} />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Chatbot
            </span>
          </button>
        </li>

        <li>
          <button onClick={() => navigate("/order")}className={`flex ${isSidebarOpen? "flex-row justify-start space-x-3": "flex-col items-center"} w-full p-2 rounded-md transition-colors ${isActive("/order") ? "bg-gray-800" : "hover:bg-gray-800"}`}>
            <FileText size={24} />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Órdenes
            </span>
          </button>
        </li>

        <li>
          <button onClick={handleLogout}className={`flex ${isSidebarOpen ? "flex-row justify-start space-x-3" : "flex-col items-center"} w-full p-2 rounded-md transition-colors hover:bg-gray-800`}>
            <LogOut size={24} />
            <span className={`${isSidebarOpen ? "block" : "hidden"}`}>
              Cerrar sesión
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;