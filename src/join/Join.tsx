import React from "react";
import { State, Action, ActionType } from "../common/reducer";

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
      <img src="../../logo512.png" className="join__logo" />
      <div className="join__buttons">
        <button
          type="button"
          onClick={setLoginStage}
          className="miscButton--main miscButton--shadow join__button"
        >
          LOGOWANIE
        </button>
        <button
          type="button"
          onClick={setRegisterStage}
          className="miscButton--main miscButton--shadow join__button"
        >
          REJESTRACJA
        </button>
      </div>
    </div>
  );
};

export default Join;
