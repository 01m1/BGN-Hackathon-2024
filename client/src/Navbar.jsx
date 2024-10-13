import React from 'react';
import './css/Navbar.css';

const Navbar = () => {
  return (

        <nav className="navbar">
            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <a href="/">FYP</a>
                    </li>
                    <li>
                        <a href="/Quiz">Quiz</a>
                    </li>
                    <li>
                        <a href="/Profile">Profile</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;