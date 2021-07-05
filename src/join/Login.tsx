import React, { FormEventHandler } from "react";
import { State, Action, ActionType } from "../common/reducer";

import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const Login = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const [creds, setCreds] = React.useState({
    name: "",
    password: "",
    passwordCheck: "",
  });

  const [message, setMessage] = React.useState("");

  const setTemporaryMessage = (message: string) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (creds.password !== creds.passwordCheck) {
      setTemporaryMessage("Logowanie nie powiodło się");
      return;
    }

    (async () => {
      if (props.state.db) {
        const userQuery = query(
          collection(props.state.db, "users"),
          where("name", "==", creds.name)
        );
        const userQuerySnapshot = await getDocs(userQuery);
        userQuerySnapshot.forEach((doc) => {
          if (doc.data().password === creds.password) {
            props.dispatch({
              type: ActionType.SetUserID,
              payload: doc.id,
            });
            props.dispatch({
              type: ActionType.SetTeamID,
              payload: doc.data().teamID,
            });
            props.dispatch({
              type: ActionType.SetStageStart,
              payload: "",
            });
            if (props.state.db) {
              const teamsQuery = query(
                collection(props.state.db, "teams"),
                where("leaderID", "==", doc.id)
              );
              (async () => {
                const teamsQuerySnapshot = await getDocs(teamsQuery);
                props.dispatch({
                  type: ActionType.SetIsTeamLeader,
                  payload: !teamsQuerySnapshot.empty
                });
              })();
            }
          } else {
            setTemporaryMessage("Logowanie nie powiodło się");
          }
          return;
        });
      }
    })();
  };
  
  React.useEffect(() => {
    setCreds({name: "", password: "", passwordCheck: ""});
    setMessage("");
  }, [props.state.stage]);

  return (
    <div
      style={{
        display: props.state.stage === "login" ? "initial" : "none",
        height: "100%",
      }}
    >
      <form onSubmit={submitHandler}>
        <label htmlFor="loginName">Nazwa użytkownika</label>
        <input
          type="text"
          id="loginName"
          name="loginName"
          value={creds.name}
          onChange={(e) => setCreds({ ...creds, name: e.target.value })}
        ></input>

        <label htmlFor="loginName">Hasło</label>
        <input
          type="password"
          id="loginPassword"
          name="loginPassword"
          value={creds.password}
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        ></input>

        <label htmlFor="loginName">Powtórz hasło</label>
        <input
          type="password"
          id="loginPasswordCheck"
          name="loginPasswordCheck"
          value={creds.passwordCheck}
          onChange={(e) =>
            setCreds({ ...creds, passwordCheck: e.target.value })
          }
        ></input>

        <button type="submit">SUBMIT</button>
      </form>
      <h2>{message}</h2>
    </div>
  );
};

export default Login;
