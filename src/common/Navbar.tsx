import React from 'react';
import {FcMenu} from "react-icons/fc";
import {State, Action, ActionType} from "./reducer";

import "./navbar.css";

const Navbar = (props: {state: State, dispatch: React.Dispatch<Action>}) => {
    const toggleMenu = () => {
        if (props.state.isMenuVisible) props.dispatch({type: ActionType.HideMenu, payload: ""});
        else props.dispatch({type: ActionType.ShowMenu, payload: ""});
    }

  return (
      <div className="navbar">
          <FcMenu style={{height: "100%", width: "15%", background: "yellow"}} onClick={toggleMenu}/>
        
      </div>
  );
}

export default Navbar;
