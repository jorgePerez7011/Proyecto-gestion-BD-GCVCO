import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiKey, FiMail } from "react-icons/fi";

export const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [etapa, setEtapa] = useState(1); 
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleEnviarCodigo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email }
      );
      setMessage(`Código: ${res.data.code}`);
      setEtapa(2);
    } catch (error) {
      setMessage("Correo no esta registrado");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:5000/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      setMessage("Contraseña actualizada correctamente");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage("Error al actualizar la contraseña");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#e0f2fe]"style={{background: 'linear-gradient(0deg, rgba(92,187,189,1) 11%, rgba(54,134,241,1) 56%, rgba(45,121,253,1) 100%)',}}>
      <div className="bg-white p-6 rounded-sm shadow-lg w-[360px] text-center">
        <h2 className="text-xl font-semibold mb-4">Recuperar contraseña</h2>

        <div className="mb-3">
          <label className="block text-sm mb-1">Correo electrónico</label>
          <div className="flex items-center bg-gray-100 rounded-md px-2">
            <FiMail />
            <input type="email"className="bg-transparent outline-none w-full p-1"value={email}onChange={(e) => setEmail(e.target.value)}/>
          </div>
        </div>

        {etapa === 2 && (
          <>
            <div className="mb-3">
              <label className="block text-sm mb-1">Código de recuperación</label>
              <input type="text"className="w-full p-1 border rounded-md"value={code}onChange={(e) => setCode(e.target.value)}/>
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Nueva contraseña</label>
              <div className="flex items-center bg-gray-100 rounded-md px-2">
                <FiKey />
                <input type="password"className="bg-transparent outline-none w-full p-1"value={newPassword}onChange={(e) => setNewPassword(e.target.value)}/>
              </div>
            </div>
          </>
        )}

        <button onClick={etapa === 1 ? handleEnviarCodigo : handleResetPassword}className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-lg mt-2">
          {etapa === 1 ? "Enviar código" : "Restablecer contraseña"}
        </button>

        {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default RecoverPassword;