import { useState } from "react";
import { Search, X } from "lucide-react";

const CustomerSearchModal = ({ onSearch, onClose }) => {
  const [document, setDocument] = useState("");

  const handleSearchClick = () => {
    onSearch(document);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-sm shadow-xl w-full max-w-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Buscar cliente</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X />
          </button>
        </div>

        <input type="text"placeholder="Ingrese número de documento"className="w-full p-2 border rounded"value={document}onChange={(e) => setDocument(e.target.value)}/>

        <button onClick={handleSearchClick}className="flex items-center space-x-2 bg-[#000080] text-white px-4 py-2 rounded hover:bg-blue-800 w-full justify-center">
          <Search size={18} />
          <span>Buscar</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerSearchModal;