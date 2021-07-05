import React from "react";
import { State, Action, ActionType } from "./reducer";
import { FaBars, FaPowerOff } from "react-icons/fa";

import "./navbar.css";

const Navbar = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const toggleMenu = () => {
    if (!props.state.isMenuVisible) props.dispatch({ type: ActionType.ShowMenu, payload: "" });
    //   props.dispatch({ type: ActionType.HideMenu, payload: "" });
    // else 
  };

  const logOut = () => {
      props.dispatch({ type: ActionType.HideMenu, payload: "" });
      props.dispatch({ type: ActionType.SetStageJoin, payload: "" });
      props.dispatch({ type: ActionType.SetTeamID, payload: "" });
      props.dispatch({ type: ActionType.SetIsTeamLeader, payload: false });
      props.dispatch({ type: ActionType.SetUserID, payload: "" });
  };

  return (
    <div className="navbar">
      <FaBars
        style={{ height: "100%", width: "15%", background: "yellow" }}
        onClick={toggleMenu}
      />
      <FaPowerOff
        style={{ height: "100%", width: "15%", background: "yellow" }}
        onClick={logOut}
      />
    </div>
  );
};

export default Navbar;
