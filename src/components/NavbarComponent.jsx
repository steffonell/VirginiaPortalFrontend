import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import "./NavbarComponent.css";
import { ApplicationContext } from "./ApplicationContext";
import { useLogout } from "./useLogout";

const NavbarComponent = () => {
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
        <li className="nav-item user-data desktop">
          <div className="nav-item-wrapper">
            <NavLink to="#" className="nav-link">
              Korisnički Profil &#x25BE; {/* This is a Unicode character for a down arrow */}
            </NavLink>
            <div className="dropdown-menu">
              <div className="dropdown-item">Korisnik : <strong> {loggedInClient.nameOfTheLegalEntity} </strong> </div>
              <div className="dropdown-item">Uloga : <strong> {userRole} </strong></div>
              <NavLink to="/userInfo" className="button-primary">O profilu</NavLink>
              <NavLink to="/change-password" className="button-primary">Promeni Šifru</NavLink>
              <NavLink onClick={logoutFunction} className="button-secondary">Odjavi se</NavLink>
            </div>
          </div>
        </li>
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
        <li className="nav-item user-data mobile">
          <div className="nav-item-wrapper">
            <NavLink to="#" className="nav-link">
              Korisnički Profil &#x25BE; {/* This is a Unicode character for a down arrow */}
            </NavLink>
            <div className="dropdown-menu">
              <div className="dropdown-item">Korisnik : <strong> {loggedInClient.nameOfTheLegalEntity} </strong> </div>
              <div className="dropdown-item">Uloga : <strong> {userRole} </strong></div>
              <NavLink to="/userInfo" className="button-primary">O profilu</NavLink>
              <NavLink to="/change-password" className="button-primary">Promeni Šifru</NavLink>
              <NavLink onClick={logoutFunction} className="button-secondary">Odjavi se</NavLink>
            </div>
          </div>
        </li>
      </ul>
      <div className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </div>
    </nav>
  );
};

export default NavbarComponent;
