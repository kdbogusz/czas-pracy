import React, { useState } from "react";
import { State, Action, ActionType } from "../common/reducer";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

import "../start/start.css";
import "../common/common.css";
import CreateTeam from "./CreateTeam";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";

const NoTeam = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const [promiseInProgress, setPromiseInProgress] = useState(false);
  const [passcode, setPasscode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const { t } = useTranslation();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (async () => {
      setPromiseInProgress(true)
      if (props.state.db) {
        const teamQuery = query(
          collection(props.state.db, "teams"),
          where("passcode", "==", passcode)
        );
        const teamQuerySnapshot = await getDocs(teamQuery);
        teamQuerySnapshot.size === 0 && setErrorMessage("Wrong code!!!")
        teamQuerySnapshot.forEach((team) => {
          props.dispatch({
            type: ActionType.SetTeamID,
            payload: team.id,
          });
          (async () => {
            try {
              if (props.state.db) {
                const userRef = doc(
                  props.state.db,
                  "users",
                  props.state.userID
                );
                await updateDoc(userRef, {
                  teamID: team.id,
                });
              }
              props.dispatch({
                type: ActionType.SetStageStart,
                payload: "",
              });
              props.dispatch({
                type: ActionType.ShowNavBar,
                payload: true,
              });
            } catch (e) {
            }
          })();
        });
      }
      setPromiseInProgress(false)
    })();
  };

  return (
    <div
      className={
        props.state.stage === "noTeam"
          ? "start start--layout noteam"
          : "start start--hidden"
      }
    >
      <div className="noteam-container__card">
        <div className="noteam-hole"></div>
        {t("joinTheTeam")}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="passcode"
            placeholder={`${t("passcode")}...`}
            name="passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          ></input>
          <button type="submit">{t("submit")}</button>
        </form>
        {promiseInProgress && <Loader type="ThreeDots" color="#ffffff" height="100" width="100" />}
        <p>{errorMessage}</p>
      </div>
      <CreateTeam state={props.state} dispatch={props.dispatch} />

    </div>
  );
};

export default NoTeam;
