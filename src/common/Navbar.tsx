import React from "react";
import { State, Action, ActionType } from "./reducer";
import { FaBars, FaPowerOff } from "react-icons/fa";
import { useTranslation } from "react-i18next"
import "./navbar.css";
import "../common/common.css";

const Navbar = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const { t } = useTranslation();
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
    props.dispatch({ type: ActionType.ShowNavBar, payload: false });
  };
  const setLoginStage = () => {
    props.dispatch({
      type: ActionType.SetStageLogin,
      payload: "",
    });
  };

  const setRegisterStage = () => {
    props.dispatch({
      type: ActionType.SetStageRegister,
      payload: "",
    });
  };

  return (
    <>
    {props.state.ShowNavBar ? <div className="navbar">
      <FaBars className="navbarButton--size miscButton--main navbar-btn__hamburger" onClick={toggleMenu} />
      {!["join", "login", "register"].includes(props.state.stage) && (
        <FaPowerOff className="navbarButton--size miscButton--main" onClick={logOut} />
      )}
    </div>:
    <div className="navbar-btn">
     <button onClick={setLoginStage}>{t('login')}</button>
     <button onClick={setRegisterStage}>{t("registration")}</button>
  </div>}
    </>
  );
};

export default Navbar;
