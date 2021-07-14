import React from 'react';

const NavbarButton = (props: { text: string, callback: () => void, classes: string }) => {
    return (
        <div className={props.classes} onClick={props.callback}>
            {props.text}
        </div>
    );
};

export default NavbarButton;