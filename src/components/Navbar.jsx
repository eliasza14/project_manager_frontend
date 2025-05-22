import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Optional: custom styling

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">🏠 Home</Link>
        </li>
        <li className={location.pathname === '/pmoverview' ? 'active' : ''}>
          <Link to="/pmoverview">📊 PM Overview</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;