import React from "react";
import { State, Action, ActionType } from "../common/reducer";

const Join = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
    const setLoginStage = () => {
        props.dispatch({
            type: ActionType.SetStageLogin,
            payload: "",
        });
    }

    const setRegisterStage = () => {
        props.dispatch({
            type: ActionType.SetStageRegister,
            payload: "",
        });
    }

  return (
    <div
      style={{
        display: props.state.stage === "join" ? "initial" : "none",
        height: "100%",
      }}
    >
      <button type="button" onClick={setLoginStage}>LOGIN</button>
      <button type="button" onClick={setRegisterStage}>REGISTER</button>
    </div>
  );
};

export default Join;
