import React from "react";
import { FaBriefcase, FaMugHot, FaBed } from "react-icons/fa";
import {State, Action, ActionType} from "../common/reducer";

import "./start.css";
import "../common/common.css";

const Start = (props: {state: State, dispatch: React.Dispatch<Action>}) => {
  const buttonStyle = {
    height: "25vw",
    width: "25vw",
    background: "yellow",
    padding: "1rem 1rem 1rem 1rem",
  };

  return (
    <div className={props.state.stage === "start" ? "start start--layout" : "start start--hidden"} >
      <FaBriefcase style={buttonStyle} />
      <FaMugHot style={buttonStyle} />
      <FaBed style={buttonStyle} />
    </div>
  );
}

export default Start;
