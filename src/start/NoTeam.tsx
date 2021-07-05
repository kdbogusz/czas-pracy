import React from "react";
import { FaBriefcase, FaMugHot, FaBed } from "react-icons/fa";
import {State, Action, ActionType} from "../common/reducer";

import {
    collection,
    documentId,
    getDocs,
    query,
    where,
    writeBatch,
    doc,
  } from "firebase/firestore";

import "./start.css";
import "../common/common.css";

const Start = (props: {state: State, dispatch: React.Dispatch<Action>}) => {
    const [passcode, setPasscode] = React.useState("");

  const buttonStyle = {
    height: "25vw",
    width: "25vw",
    background: "yellow",
    padding: "1rem 1rem 1rem 1rem",
  };

//   const handleSubmit = () => {
//     (async () => {
//         if (props.state.db) {
//           const teamQuery = query(
//             collection(props.state.db, "teams"),
//             where("passcode", "==", passcode)
//           );
//           const teamQuerySnapshot = await getDocs(teamQuery);\

//           teamQuerySnapshot.forEach((doc) => {
//               props.dispatch({
//                 type: ActionType.SetTeamID,
//                 payload: doc.id,
//               });
//               (async () => { try {
//                 if (props.state.db) {
//                   const batch = writeBatch(props.state.db);
//                     const userRef = doc(props.state.db, "users", props.state.userID);
//                 }
//                 props.dispatch({
//                   type: ActionType.SetUserID,
//                   payload: docRef.id,
//                 });
//                 props.dispatch({
//                   type: ActionType.SetStageStart,
//                   payload: "",
//                 });
//               } catch (e) {
//                   // TODO
//               }
//               })();
              

//               if (props.state.db) {
//                 const teamsQuery = query(
//                   collection(props.state.db, "teams"),
//                   where("leaderID", "==", doc.id)
//                 );
//                 (async () => {
//                   const teamsQuerySnapshot = await getDocs(teamsQuery);
//                   props.dispatch({
//                     type: ActionType.SetIsTeamLeader,
//                     payload: !teamsQuerySnapshot.empty
//                   });
//                 })();
//               }
//             } else {
//               setTemporaryMessage("Logowanie nie powiodło się");
//             }
//             return;
//           });
//         }
//       })();
//   };

  return (
    <div className={props.state.stage === "start" ? "start start--layout" : "start start--hidden"} >
      <button onClick={() => {console.log(props.state)}}>SH</button>
      DOŁĄCZ DO TEAMU
      {/* <form onSubmit={handleSubmit}> */}
      <form>
        <label htmlFor="passcode">Passcode</label>
        <input
          type="text"
          id="passcode"
          name="passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        ></input>
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
}

export default Start;
