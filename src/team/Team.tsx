import React from "react";
import { State, Action, ActionType } from "../common/reducer";
import './teamInfo.css'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";

import "../start/start.css";
import "../common/common.css";
import TeamInfo from "./TeamInfo";

const Team = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
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
          ? "start start--layout teamInfo"
          : "start start--hidden"
      }
    >
       <div className="card shadow mb-4">
        <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Team</h6>
        </div>
        <div className="card-body">
        <div className="team-container">
        <TeamInfo state={props.state} dispatch={props.dispatch} />
        <div>
          {props.state.isTeamLeader ? (
            <button
              type="button"
              className="miscButton--delete"
              onClick={deleteHandler}
            >
              USUŃ TEAM
            </button>
          ) : (
            <button
              type="button"
              className="miscButton--delete "
              onClick={() => leaveHandler(props.state.userID)}
            >
              OPUŚĆ TEAM
            </button>
          )}
        </div>
      </div>
        </div>
    </div>

    </div>
  );
};

export default Team;
