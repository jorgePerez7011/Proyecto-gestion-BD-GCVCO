import React from "react";
import { Save, Trash2, X } from "lucide-react";

const CustomerModal = ({ cliente, onChange, onSave, onDelete, onClose }) => {
  if (!cliente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
        <h3 className="text-xl font-semibold mb-2">Editar cliente</h3>
        <input type="text"name="name"value={cliente.name}onChange={onChange}className="w-full p-2 border rounded"placeholder="Nombre"/>
        <input type="text"name="email"value={cliente.email}onChange={onChange}className="w-full p-2 border rounded"placeholder="Correo"/>
        <input type="text"name="city"value={cliente.city}onChange={onChange}className="w-full p-2 border rounded"placeholder="Ciudad"/>
        <input type="text"name="phone"value={cliente.phone}onChange={onChange}className="w-full p-2 border rounded"placeholder="Teléfono"/>

        <div className="flex justify-between mt-4">
          <button onClick={onSave}className="flex items-center space-x-2 bg-[#000080] text-white px-4 py-2 rounded hover:bg-blue-800">
            <Save size={18} />
            <span>Guardar</span>
          </button>
          <button onClick={onDelete}className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800">
            <Trash2 size={18} />
            <span>Eliminar</span>
          </button>
          <button onClick={onClose}className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-800">
            <X size={18} />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
