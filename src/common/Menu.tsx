import React from "react";
import { State, Action, ActionType } from "./reducer";
import OutsideClickHandler from "react-outside-click-handler";

import "./navbar.css";

import NavbarButton from "./NavbarButton";

const Menu = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const hideMenu = () => {
    props.dispatch({
      type: ActionType.HideMenu,
      payload: "",
    });
  };

  const setStartCallback = () => {
    props.dispatch({
      type: ActionType.SetStageStart,
      payload: "",
    });
    hideMenu();
  };

  const setCalendarCallback = () => {
    props.dispatch({
      type: ActionType.SetStageCalendar,
      payload: "",
    });
    hideMenu();
  };

  const setDeclerationsCallback = () => {
    props.dispatch({
      type: ActionType.SetStageDeclarations,
      payload: "",
    });
    hideMenu();
  };

  const setLoginCallback = () => {
    props.dispatch({
      type: ActionType.SetStageLogin,
      payload: "",
    });
    hideMenu();
  };

  const setRegisterCallback = () => {
    props.dispatch({
      type: ActionType.SetStageRegister,
      payload: "",
    });
    hideMenu();
  };

  const setTeamCallback = () => {
    props.dispatch({
      type: ActionType.SetStageTeam,
      payload: "",
    });
    hideMenu();
  };

  const setNoTeamCallback = () => {
    props.dispatch({
      type: ActionType.SetStageNoTeam,
      payload: "",
    });
    hideMenu();
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() =>
        !props.state.isMenuVisible ? hideMenu() : setTimeout(hideMenu, 0)
      }
    >
      <div
        className={props.state.isMenuVisible ? "menu menu--visible" : "menu menu--hidden"}
      >
        {props.state.userID ? ( props.state.teamID ? (
          <>
            <NavbarButton text="START" callback={setStartCallback} />
            <NavbarButton text="KALENDARZ" callback={setCalendarCallback} />
            <NavbarButton
              text="DEKLARACJE"
              callback={setDeclerationsCallback}
            />
            <NavbarButton
              text="TEAM"
              callback={setTeamCallback}
            />
          </>
        ) : <>
        <NavbarButton text="START" callback={setNoTeamCallback} /></> ): (
          <>
            <NavbarButton text="LOGIN" callback={setLoginCallback} />
            <NavbarButton text="REJESTRACJA" callback={setRegisterCallback} />
          </>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default Menu;
