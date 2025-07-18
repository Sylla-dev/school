import React, { useEffect, useState, useRef } from "react";
import { FaBars, FaUserCircle, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setSidebarOpen }) {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) setUser(JSON.parse(localUser));
  }, []);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    setOpenMenu(false);
  };

  return (
    <header className="bg-base-100 shadow p-4 flex items-center justify-between">
      {/* Bouton ouverture sidebar sur mobile */}
      <button
        aria-label="Ouvrir le menu"
        className="md:hidden text-2xl mr-4 focus:outline-none focus:ring-2 focus:ring-primary rounded"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* Titre */}
      <h1 className="text-2xl font-semibold text-base-content">Tableau de bord</h1>

      {/* Menu utilisateur */}
      <div className="relative" ref={menuRef}>
        <button
          aria-haspopup="true"
          aria-expanded={openMenu}
          aria-label="Menu utilisateur"
          onClick={() => setOpenMenu(prev => !prev)}
          className="flex items-center gap-2 p-2 rounded-md hover:bg-base-200 transition focus:outline-none focus:ring-2 focus:ring-primary"
          type="button"
        >
          <FaUserCircle className="text-2xl text-primary" />
          <span className="hidden sm:inline text-base-content font-medium">
            {user?.role ? user.role.toUpperCase() : "Utilisateur"}
          </span>
          <FaChevronDown className={`transition-transform ${openMenu ? "rotate-180" : ""}`} />
        </button>

        {openMenu && (
          <ul
            role="menu"
            aria-label="Menu utilisateur"
            className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-md py-2 z-50"
          >
            <li className="px-4 py-2 border-b border-base-300">
              <div className="flex flex-col">
                <span className="font-semibold truncate">{user?.email || "Email non défini"}</span>
                <span className="text-sm text-gray-500">Rôle : {user?.role || "N/A"}</span>
              </div>
            </li>
            <li
              role="menuitem"
              tabIndex={0}
              onClick={handleLogout}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleLogout();
              }}
              className="flex items-center gap-2 px-4 py-2 text-error cursor-pointer hover:bg-error hover:text-error-content transition"
            >
              <FaSignOutAlt />
              <span>Se déconnecter</span>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
