import { useEffect, useState } from "react";
import { User } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState({ fullName: "", photo: "" });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error al leer el usuario desde localStorage:", error);
    }
  }, []);

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white">
      <div className="flex items-center justify-end w-full pr-4">
        <User size={20} />
        <span className="font-medium">{user.fullName.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default Navbar;