import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Perfil from "../assets/img/perfil.png";
import { FiLock } from "react-icons/fi"; 

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const registrarClick = () => {
    navigate("/registro");
  };

  const recuperarContrasenaClick = () => {
    navigate("/password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      if (response.data.message === "Login exitoso") {
        localStorage.setItem("user", JSON.stringify(response.data.secretary));

        setMessage("Login exitoso");
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Error en el login");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen"   
    style={{background: 'linear-gradient(0deg, rgba(92,187,189,1) 11%, rgba(54,134,241,1) 56%, rgba(45,121,253,1) 100%)',}}>
      <div className="bg-white text-center rounded-sm px-8 w-[360px] border-2 shadow-lg">
        <h1 className="pt-4 text-[20px]">INICIAR SESIÓN</h1>

        <div className="flex justify-center items-center my-4">
          <img className="w-[120px]" src={Perfil} alt="perfil" />
        </div>

        <form className="grid items-center text-center py-2 px-4"onSubmit={handleLogin}>
          <input name="email"type="email"className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Correo electrónico"value={email}onChange={(e) => setEmail(e.target.value)}required/>
          <input name="password"type="password"className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Contraseña"value={password}onChange={(e) => setPassword(e.target.value)}required/>

          <button type="submit"className="cursor-pointer bg-blue-500 text-white rounded-lg py-1 mb-2">
            Ingresar
          </button>

          <button type="button"onClick={registrarClick}className="cursor-pointer text-[15px] mb-1 hover:bg-blue-500 hover:text-white rounded-lg py-1">
            Registrarse
          </button>

          <button type="button"onClick={recuperarContrasenaClick}className="flex mt-4 items-center justify-center gap-2 text-sm text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md px-3 py-1 mt-1 transition-all duration-200 ease-in-out">
            <FiLock size={16} />
            ¿Olvidaste tu contraseña?
          </button>

        </form>

        {message && <p className="text-red-500 mb-4 mt-1">{message}</p>}
      </div>
    </div>
  );
};

export default Login;