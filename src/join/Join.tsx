import React from "react";
import { State, Action } from "../common/reducer";
import calendar from '../assets/img/calendar.svg'
import "../common/common.css";
import "./join.css";
import { useTranslation } from "react-i18next";

const Join = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const { t } = useTranslation();

  return (
    <div
      className="join"
      style={{
        display: props.state.stage === "join" ? "flex" : "none",
      }}
    >
      <div className="join-container">
        <img className="join-img" src={calendar} alt="calendar"/>
      </div>
      <div className="join-container join__text">
       <h3>{t("organizationOfWork")}.</h3>
      </div>
    </div>
  );
};

export default Join;
