import React from "react";
import { State, Action, ActionType } from "../common/reducer";
import calendar from '../assets/img/calendar.svg'
import "../common/common.css";
import "./join.css";

const Join = (props: { state: State; dispatch: React.Dispatch<Action> }) => {


  return (
    <div
      className="join"
      style={{
        display: props.state.stage === "join" ? "flex" : "none",
      }}
    >
      <div>
        <img className="join-img" src={calendar} />
      </div>
      <div className="join__text">
       <h3>Kalendarz</h3>
      </div>
    </div>
  );
};

export default Join;
