import { useState } from "react";

const RegisterCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: "",
    document: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  const revisarExistenciaCliente = async (document) => {
    try {
      const res = await fetch(`http://localhost:5000/customers/document/${document}`);
      if (res.ok) {
        const customer = await res.json();
        return customer;
      } else if (res.status === 404) {
        return null;
      } else {
        throw new Error("Error al verificar cliente.");
      }
    } catch (err) {
      throw err;
    }
  };

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    try {
      const customer = await revisarExistenciaCliente(customerData.document);
      if (customer) {
        setError(
          "Ya esta registrado el número de documento."
        );
        return;
      }

      const res = await fetch("http://localhost:5000/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (!res.ok) {
        throw new Error("Error al registrar el cliente.");
      }

      setMessage(`Cliente registrado correctamente`);
      setCustomerData({
        name: "",
        document: "",
        address: "",
        city: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Registrar cliente
      </h2>

      <input type="text" name="name" placeholder="Nombre*" value={customerData.name} onChange={handleInputChange}className="w-full p-2 border border-gray-300 rounded mb-3" />
      <input type="text" name="document" placeholder="Identificación*" value={customerData.document} onChange={handleInputChange}className="w-full p-2 border border-gray-300 rounded mb-3" />
      <input type="text" name="address" placeholder="Dirección" value={customerData.address} onChange={handleInputChange}className="w-full p-2 border border-gray-300 rounded mb-3" />
      <input type="text" name="city" placeholder="Ciudad" value={customerData.city} onChange={handleInputChange}className="w-full p-2 border border-gray-300 rounded mb-3" />
      <input type="text" name="phone" placeholder="Teléfono" value={customerData.phone} onChange={handleInputChange}className="w-full p-2 border border-gray-300 rounded mb-3" />
      <input type="email" name="email" placeholder="Correo electrónico*" value={customerData.email} onChange={handleInputChange}className="w-full p-2 border border-gray-300 rounded mb-3" />
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <button onClick={handleSubmit}className="w-full bg-[#000080] hover:bg-blue-800 text-white font-semibold p-2 rounded">
        Registrar cliente
      </button>
    </div>
  );
};

export default RegisterCustomer;