import React from 'react';

const NavbarButton = (props: {text: string, callback: () => void}) => {
    return (
        <div className="navbarButton" onClick={props.callback}>
            {props.text}
        </div>
    );
};
    
export default NavbarButton;