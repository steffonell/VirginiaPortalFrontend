import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./NavbarComponent.css";

const NavbarComponent = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Virdzinija Portal
      </Link>
      <ul className={`nav-menu${showMenu ? " show" : ""}`}>.

  {/*         <NavLink to="/articles" className="nav-link">Artikli</NavLink>
          <NavLink to="/clients" className="nav-link">Klijenti</NavLink>
          <NavLink to="/address/add" className="nav-link">Dodaj Adresu</NavLink>
          <NavLink to="/brands" className="nav-link">Brendovi</NavLink>
          <NavLink to="/discount" className="nav-link">Rabat</NavLink>
          <NavLink to="/indents" className="nav-link">Porudzbine</NavLink>
          <NavLink to="/indentEntry" className="nav-link">Unos Stavki Porudzbine</NavLink>
          <NavLink to="/basket" className="nav-link">Korpa</NavLink> */}
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
        <NavLink to="/address/add" onClick={toggleMenu} className="nav-link">Adrese</NavLink>
        </li>
        <li className="nav-item">
        <NavLink to="/brands" onClick={toggleMenu} className="nav-link">Brendovi</NavLink>
        </li>
        <li className="nav-item">
        <NavLink to="/discount" onClick={toggleMenu} className="nav-link">Rabat</NavLink>
        </li>
        <li className="nav-item">
        <NavLink to="/indents" onClick={toggleMenu} className="nav-link">Porudzbine</NavLink>
        </li>
        <li className="nav-item">
        <NavLink to="/basket" onClick={toggleMenu} className="nav-link">Korpa</NavLink>
        </li>
      </ul>
      <div className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </div>
    </nav>
  );
};

export default NavbarComponent;
