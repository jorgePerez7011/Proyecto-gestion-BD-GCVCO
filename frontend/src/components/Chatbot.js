import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";

const Chatbot = () => {
  const alternarSidebar = () => setEsSidebarAbierto(!esSidebarAbierto);
  const [esSidebarAbierto, setEsSidebarAbierto] = useState(false);

  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(d, t) {
        var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
        v.onload = function() {
          window.voiceflow.chat.load({
            verify: { projectID: '681597a3ea85fe5d479f0f88' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production',
            voice: {
              url: "https://runtime-api.voiceflow.com"
            }
          });
        }
        v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
        v.type = "text/javascript";
        s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `;

    // Append script to document
    document.body.appendChild(script);

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex h-screen bg-[#f5f6fa]">
      <Sidebar isSidebarOpen={esSidebarAbierto} toggleSidebar={alternarSidebar}/>
      <div className="flex-1 overflow-auto">
        <Navbar />
        <h1 className="px-8 mx-1 text-2xl font-semibold">Chatbot</h1>
        <div className="mx-auto px-8 py-4">
          {/* The Voiceflow chat widget will be automatically inserted here */}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;