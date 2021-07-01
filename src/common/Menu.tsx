import React from 'react';

import "./navbar.css";

import NavbarButton from './NavbarButton';

const Menu = () => {
    return (
        <div className="menu">
            <NavbarButton text="FIRST"/>
            <NavbarButton text="SECOND"/>
            <NavbarButton text="THIRD"/>
        </div>
    );
};
    
export default Menu;