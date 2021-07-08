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
  deleteDoc,
  deleteField,
} from "firebase/firestore";

import "../start/start.css";
import "../common/common.css";
import TeamInfo from "./TeamInfo";

const Team = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const [passcode, setPasscode] = React.useState("");

  const buttonStyle = {
    height: "25vw",
    width: "25vw",
    background: "yellow",
    padding: "1rem 1rem 1rem 1rem",
  };

  const leaveHandler = (userID: string) => {
    (async () => {
      if (props.state.db) {
        const blocksQuery = query(
          collection(props.state.db, "work_blocks"),
          where("userID", "==", userID)
        );
        const blocksQuerySnapshot = await getDocs(blocksQuery);

        blocksQuerySnapshot.forEach((block) => {
          (async () => {
            if (props.state.db) {
              const blockRef = block.ref;
              await deleteDoc(blockRef);
            }
          })();
        });

        const userRef = doc(props.state.db, "users", userID);

        await updateDoc(userRef, {
          teamID: deleteField(),
        });

        props.dispatch({
          type: ActionType.SetTeamID,
          payload: "",
        });
        props.dispatch({
          type: ActionType.SetStageNoTeam,
          payload: "",
        });
        props.dispatch({
          type: ActionType.SetStageNoTeam,
          payload: "",
        });
      }
    })();
  };

  const deleteHandler = () => {
    (async () => {
      if (props.state.db) {
        const blocksQuery = query(
          collection(props.state.db, "work_blocks"),
          where("userID", "==", props.state.userID)
        );
        const blocksQuerySnapshot = await getDocs(blocksQuery);

        blocksQuerySnapshot.forEach((block) => {
          (async () => {
            if (props.state.db) {
              const blockRef = block.ref;
              await deleteDoc(blockRef);
            }
          })();
        });

        const teamRef = doc(props.state.db, "teams", props.state.teamID);

        await deleteDoc(teamRef);

        const userRef = doc(props.state.db, "users", props.state.userID);

        await updateDoc(userRef, {
          teamID: deleteField(),
        });

        props.dispatch({
          type: ActionType.SetTeamID,
          payload: "",
        });
        props.dispatch({
          type: ActionType.SetStageNoTeam,
          payload: "",
        });
        props.dispatch({
          type: ActionType.SetStageNoTeam,
          payload: "",
        });
        props.dispatch({
          type: ActionType.SetIsTeamLeader,
          payload: false,
        });
        props.dispatch({
          type: ActionType.SetTeamPasscode,
          payload: "",
        });
      }
    })();
  };

  return (
    <div
      className={
        props.state.stage === "team"
          ? "start start--layout"
          : "start start--hidden"
      }
    >
        <TeamInfo state={props.state} dispatch={props.dispatch} />
      <div>
        {props.state.isTeamLeader ? (
          <button
            type="button"
            className="miscButton--delete miscButton--shadow"
            onClick={deleteHandler}
          >
            USUŃ TEAM
          </button>
        ) : (
          <button
            type="button"
            className="miscButton--delete miscButton--shadow"
            onClick={() => leaveHandler(props.state.userID)}
          >
            OPUŚĆ TEAM
          </button>
        )}
      </div>
    </div>
  );
};

export default Team;
