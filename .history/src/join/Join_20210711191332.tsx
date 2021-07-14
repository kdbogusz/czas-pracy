import React from "react";
import { State, Action, ActionType } from "../common/reducer";
import work from '../assets/img/login.svg'
import "../common/common.css";
import "./join.css";

const Join = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
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
    <div
      className="join"
      style={{
        display: props.state.stage === "join" ? "flex" : "none",
      }}
    >
      <img className="join-img" src={work} />
    </div>
  );
};

export default Join;
