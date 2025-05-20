import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Perfil from "../assets/img/perfil.png";

export const Register = () => {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        firstName,
        middleName,
        lastName,
        secondLastName,
        email,
        phone,
        yearsOfExperience,
        password,
      });

      if (response.data.message === "Secretaria registrada con éxito") {
        setMessage("Registro exitoso");
        setTimeout(() => {
          navigate("/login"); 
        }, 2000);
      }
    } catch (error) {
      setMessage("Error al registrar la secretaria");
      console.error(error);
    }
  };

  return (
    <div style={{background: 'linear-gradient(0deg, rgba(92,187,189,1) 11%, rgba(54,134,241,1) 56%, rgba(45,121,253,1) 100%)',}}>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white text-center rounded-sm px-8 w-[360px] border-2 shadow-lg">
          <h1 className="pt-4 text-[20px]">REGISTRARSE</h1>
          <div className="flex justify-center items-center my-4">
            <img className="w-[120px]" src={Perfil} alt="perfil" />
          </div>

          <form className="grid items-center text-center py-2 px-4" onSubmit={handleRegister}>
            <input name="firstName"className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Primer nombre"type="text"value={firstName}onChange={(e) => setFirstName(e.target.value)}required/>
            <input name="middleName"className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Segundo nombre"type="text"value={middleName}onChange={(e) => setMiddleName(e.target.value)}/>
            <input name="lastName"className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Primer apellido"type="text"value={lastName}onChange={(e) => setLastName(e.target.value)}required/>
            <input name="secondLastName"className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Segundo apellido"type="text"value={secondLastName}onChange={(e) => setSecondLastName(e.target.value)}/>
            <input name="email"className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Correo electrónico"type="email"value={email}onChange={(e) => setEmail(e.target.value)}required/>
            <input name="phone"className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Teléfono"type="text"value={phone}onChange={(e) => setPhone(e.target.value)}required/>
            <input name="yearsOfExperience"className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Años de experiencia"type="number"value={yearsOfExperience}onChange={(e) => setYearsOfExperience(e.target.value)}required/>
            <input name="password"className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Contraseña"type="password"value={password}onChange={(e) => setPassword(e.target.value)}required/>

            <button type="submit" className="cursor-pointer bg-blue-500 text-white rounded-lg py-1 mb-2">
              Registrarse
            </button>

            <button onClick={() => navigate("/login")}type="button"className="cursor-pointer text-[15px] mb-2 hover:bg-blue-500 hover:text-[white] rounded-lg py-1">
              Volver a iniciar Sesión
            </button>
          </form>

          {message && <p className="text-black font-bold mb-4 mt-1">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;