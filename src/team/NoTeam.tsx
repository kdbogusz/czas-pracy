import React from "react";
import { FaBriefcase, FaMugHot, FaBed } from "react-icons/fa";
import { State, Action, ActionType } from "../common/reducer";

import {
  collection,
  documentId,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
  updateDoc,
} from "firebase/firestore";

import "../start/start.css";
import "../common/common.css";
import { useState } from "react";
import CreateTeam from "./CreateTeam";

const NoTeam = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const [passcode, setPasscode] = React.useState("");
  const [errorMessage, setErrorMessage]=React.useState("");

  const buttonStyle = {
    height: "25vw",
    width: "25vw",
    background: "yellow",
    padding: "1rem 1rem 1rem 1rem",
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (async () => {
      if (props.state.db) {
        const teamQuery = query(
          collection(props.state.db, "teams"),
          where("passcode", "==", passcode)
        );
        const teamQuerySnapshot = await getDocs(teamQuery);
          teamQuerySnapshot.size===0 && setErrorMessage("Wrong code!!!")
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
            } catch (e) {
            }
          })();
        });
      }
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
        DOŁĄCZ DO TEAMU
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="passcode"
            placeholder="passcode..."
            name="passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          ></input>
          <button type="submit">SUBMIT</button>
        </form>
        <p>{errorMessage}</p>
      </div>
      <CreateTeam state={props.state} dispatch={props.dispatch}/>
    </div>
  );
};

export default NoTeam;
