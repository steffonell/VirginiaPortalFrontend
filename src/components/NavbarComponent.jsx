import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import "./NavbarComponent.css";
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
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Virdzinija Portal
      </Link>
      <ul className={`nav-menu${showMenu ? " show" : ""}`}>
        {userRole === "ROLE_ADMIN" && (
          <>
            <li className="nav-item">
              <NavLink to="/shop" onClick={toggleMenu} className="nav-link">Shop</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/articles" onClick={toggleMenu} className="nav-link">Artikli</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/clients" onClick={toggleMenu} className="nav-link">Klijenti</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/brands" onClick={toggleMenu} className="nav-link">Brendovi</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/statistics" onClick={toggleMenu} className="nav-link">Statistika</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/indents" onClick={toggleMenu} className="nav-link">Porudzbine</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/basket" onClick={toggleMenu} className="nav-link">Korpa</NavLink>
            </li>
          </>
        )}
        {userRole === "ROLE_USER" && (
          <>
            <li className="nav-item">
              <NavLink to="/shop" onClick={toggleMenu} className="nav-link">Shop</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/indents" onClick={toggleMenu} className="nav-link">Porudzbine</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/statistics" onClick={toggleMenu} className="nav-link">Statistika</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/basket" onClick={toggleMenu} className="nav-link">Korpa</NavLink>
            </li>
          </>
        )}
        {(userRole === "ROLE_FAKTURISTA" || userRole === "ROLE_MAGACIONER") && (
          <>
            <li className="nav-item">
              <NavLink to="/indents" onClick={toggleMenu} className="nav-link">Porudzbine</NavLink>
            </li>
          </>
        )}
        <li className="relative group">
          <div className="flex items-center cursor-pointer px-6 py-1 text-white text-base" onClick={() => setOpen(!open)}>
            <span className="mr-2">Korisnički Profil</span>
            <svg className={`${open ? 'transform rotate-180' : ''} transition-transform duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {open && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <div className="flex items-center px-4 py-2 text-base text-gray-700">Korisnik: <strong className="ml-2">{loggedInClient.nameOfTheLegalEntity}</strong></div>
                <NavLink to="/userInfo" className="block px-4 py-2 text-base text-blue-600 hover:bg-gray-100">O profilu</NavLink>
                <NavLink to="/change-password" className="block px-4 py-2 text-base text-blue-600 hover:bg-gray-100">Promeni Šifru</NavLink>
                <NavLink onClick={logoutFunction} className="block px-4 py-2 text-base text-blue-600 hover:bg-gray-100">Odjavi se</NavLink>
              </div>
            </div>
          )}
        </li>
      </ul>
      <div className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </div>
    </nav>
  );
};

export default NavbarComponent;
