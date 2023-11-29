import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";
import { useLogout } from "./useLogout";

const NavbarComponent = () => {
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { userRole, loggedInClient, logout } = useContext(ApplicationContext);
  const logoutFunction = useLogout();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center text-2xl font-semibold tracking-wide hover:text-blue-400">
          <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 15.5a4.5 4.5 0 0 0 3 4 4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0-3 4" />
            <path d="M14 8.5a4.5 4.5 0 0 0-3-4 4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 3-4" />
            <line x1="10" y1="15.5" x2="14" y2="8.5" />
          </svg>

          Virdzinija Portal
        </Link>
        <div className="hidden md:flex space-x-4">
          {userRole === "ROLE_ADMIN" && (
            <>
              <NavLink to="/shop" className="hover:text-gray-300">Shop</NavLink>
              <NavLink to="/articles" className="hover:text-gray-300">Artikli</NavLink>
              <NavLink to="/clients" className="hover:text-gray-300">Klijenti</NavLink>
              <NavLink to="/brands" className="hover:text-gray-300">Brendovi</NavLink>
              <NavLink to="/statistics" className="hover:text-gray-300">Statistika</NavLink>
              <NavLink to="/indents" className="hover:text-gray-300">Porudzbine</NavLink>
              <NavLink to="/basket" className="hover:text-gray-300">Korpa</NavLink>
            </>
          )}
          {userRole === "ROLE_USER" && (
            <>
              <NavLink to="/shop" className="hover:text-gray-300">Shop</NavLink>
              <NavLink to="/indents" className="hover:text-gray-300">Porudzbine</NavLink>
              <NavLink to="/statistics" className="hover:text-gray-300">Statistika</NavLink>
              <NavLink to="/basket" className="hover:text-gray-300">Korpa</NavLink>
            </>
          )}
          {(userRole === "ROLE_FAKTURISTA" || userRole === "ROLE_MAGACIONER") && (
            <>
              <NavLink to="/indents" className="hover:text-gray-300">Porudzbine</NavLink>
            </>
          )}
          <div className="relative group">
            <div className="flex items-center cursor-pointer" onClick={() => setOpen(!open)}>
              <span className="mr-2">Korisnički Profil</span>
              <svg className={`${open ? 'transform rotate-180' : ''} transition-transform duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {open && (
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div className="flex items-center px-4 py-2 text-gray-700">Korisnik: <strong className="ml-2">{loggedInClient.nameOfTheLegalEntity}</strong></div>
                  <NavLink to="/userInfo" className="block px-4 py-2 text-blue-600 hover:bg-gray-100">O profilu</NavLink>
                  <NavLink to="/change-password" className="block px-4 py-2 text-blue-600 hover:bg-gray-100">Promeni Šifru</NavLink>
                  <NavLink onClick={logoutFunction} className="block px-4 py-2 text-blue-600 hover:bg-gray-100">Odjavi se</NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden" onClick={toggleMenu}>
          {/* Hamburger Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </div>
      <div className={`md:hidden ${showMenu ? "block" : "hidden"} p-4 bg-gray-800`}>
        {/* Mobile Menu */}
        {userRole === "ROLE_ADMIN" && (
          <>
            <NavLink to="/shop" className="block py-2 hover:bg-gray-700">Shop</NavLink>
            <NavLink to="/articles" className="block py-2 hover:bg-gray-700">Artikli</NavLink>
            <NavLink to="/clients" className="block py-2 hover:bg-gray-700">Klijenti</NavLink>
            <NavLink to="/brands" className="block py-2 hover:bg-gray-700">Brendovi</NavLink>
            <NavLink to="/statistics" className="block py-2 hover:bg-gray-700">Statistika</NavLink>
            <NavLink to="/indents" className="block py-2 hover:bg-gray-700">Porudzbine</NavLink>
            <NavLink to="/basket" className="block py-2 hover:bg-gray-700">Korpa</NavLink>
          </>
        )}
        {userRole === "ROLE_USER" && (
          <>
            <NavLink to="/shop" className="block py-2 hover:bg-gray-700">Shop</NavLink>
            <NavLink to="/indents" className="block py-2 hover:bg-gray-700">Porudzbine</NavLink>
            <NavLink to="/statistics" className="block py-2 hover:bg-gray-700">Statistika</NavLink>
            <NavLink to="/basket" className="block py-2 hover:bg-gray-700">Korpa</NavLink>
          </>
        )}
        {(userRole === "ROLE_FAKTURISTA" || userRole === "ROLE_MAGACIONER") && (
          <>
            <NavLink to="/indents" className="block py-2 hover:bg-gray-700">Porudzbine</NavLink>
          </>
        )}
        <div className="mt-4 bg-gray-800 rounded-lg shadow-md">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <span className="text-gray-400">Korisnik:</span>
            <strong className="text-white">{loggedInClient.nameOfTheLegalEntity}</strong>
          </div>
          <div>
            <NavLink to="/userInfo" className="block px-4 py-2 text-blue-600 hover:bg-gray-700 hover:text-white">O profilu</NavLink>
            <NavLink to="/change-password" className="block px-4 py-2 text-blue-600 hover:bg-gray-700 hover:text-white">Promeni Šifru</NavLink>
            <NavLink onClick={logoutFunction} className="block px-4 py-2 text-blue-600 hover:bg-gray-700 hover:text-white">Odjavi se</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
