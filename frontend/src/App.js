import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import RecoverPassword from "./components/recoverPassword";
import ProductGUI from "./components/ProductGUI";
import OrderGUI from "./components/OrderGUI";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/password" element={<RecoverPassword />} />
        <Route path="/product" element={<ProductGUI />} />
        <Route path="/order" element={<OrderGUI />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;