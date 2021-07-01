import React from 'react';

const NavbarButton = (props: {text: string}) => {
    return (
        <div className="navbarButton">
            {props.text}
        </div>
    );
};
    
export default NavbarButton;