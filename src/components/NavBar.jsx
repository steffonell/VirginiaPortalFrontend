import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";
import "./navbar.css";
import { Navbar, Nav } from "react-bootstrap";

const NavbarComponent = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const { loggedInClient, authenticated } = useContext(ApplicationContext);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (showNavbar) {
      setShowNavbar(false);
    }
  }, [window.location.pathname]);

  if (authenticated === null || !authenticated) {
    return null;
  }

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <Navbar className={`navbar ${showNavbar ? "show" : ""}`} bg="light" expand="md">
      <Navbar.Brand>
        <img src={require('./logo.jpg')} alt="Logo Image" />
      </Navbar.Brand>
      <Navbar.Toggle className="navbar-toggle-custom" aria-controls="basic-navbar-nav" onClick={handleShowNavbar} />
      <Navbar.Collapse id="basic-navbar-nav" className="custom-navbar-collapse">
        <Nav className="mr-auto" onClick={handleShowNavbar}>
          <NavLink to="/shop" className="nav-link">Shop</NavLink>
          <NavLink to="/articles" className="nav-link">Artikli</NavLink>
          <NavLink to="/clients" className="nav-link">Klijenti</NavLink>
          <NavLink to="/address/add" className="nav-link">Dodaj Adresu</NavLink>
          <NavLink to="/brands" className="nav-link">Brendovi</NavLink>
          <NavLink to="/discount" className="nav-link">Rabat</NavLink>
          <NavLink to="/indents" className="nav-link">Porudzbine</NavLink>
          <NavLink to="/indentEntry" className="nav-link">Unos Stavki Porudzbine</NavLink>
          <NavLink to="/basket" className="nav-link">Korpa</NavLink>
        </Nav>
        {loggedInClient && (
          <span className="navbar-text ml-auto">
            {loggedInClient.nameOfTheLegalEntity}
          </span>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;

