import React from "react";
import { State, Action, ActionType } from "./reducer";
import { FaBars, FaPowerOff } from "react-icons/fa";

import "./navbar.css";
import "../common/common.css";

const Navbar = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const toggleMenu = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();

    if (!props.state.isMenuVisible)
      props.dispatch({ type: ActionType.ShowMenu, payload: "" });
  };

  const logOut = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();

    props.dispatch({ type: ActionType.HideMenu, payload: "" });
    props.dispatch({ type: ActionType.SetStageJoin, payload: "" });
    props.dispatch({ type: ActionType.SetTeamID, payload: "" });
    props.dispatch({ type: ActionType.SetIsTeamLeader, payload: false });
    props.dispatch({ type: ActionType.SetUserID, payload: "" });
    props.dispatch({ type: ActionType.SetTeamPasscode, payload: "" });
  };

  return (
    <div className="navbar">
      <FaBars className="navbarButton--size miscButton--main navbar-btn__hamburger" onClick={toggleMenu} />
      {!["join", "register"].includes(props.state.stage) && (
        <FaPowerOff className="navbarButton--size miscButton--main" onClick={logOut} />
      )}
    </div>
  );
};

export default Navbar;
