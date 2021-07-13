import React from "react";
import { State, Action, ActionType } from "./reducer";
import OutsideClickHandler from "react-outside-click-handler";

import "./navbar.css";

import NavbarButton from "./NavbarButton";
import { useTranslation } from "react-i18next";

const Menu = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const { t } = useTranslation();

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
            <NavbarButton text={`${t("start")}`} callback={setStartCallback} />
            <NavbarButton text={`${t("calendar")}`} callback={setCalendarCallback} />
            <NavbarButton
              text={`${t("declarations")}`}
              callback={setDeclerationsCallback}
            />
            <NavbarButton
              text={`${t("team")}`}
              callback={setTeamCallback}
            />
          </>
        ) : <>
        <NavbarButton text={`${t("start")}`} callback={setNoTeamCallback} /></> ): (
          <>
            <NavbarButton text={`${t("login")}`} callback={setLoginCallback} />
            <NavbarButton text={`${t("registartion")}`} callback={setRegisterCallback} />
          </>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default Menu;
