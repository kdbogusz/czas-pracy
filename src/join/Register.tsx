import React from "react";
import { State, Action, ActionType } from "../common/reducer";

import {
  collection,
  documentId,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";

const Register = (props: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
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
      setTemporaryMessage("Rejestracja nie powiodła się");
      return;
    }

    (async () => {
      if (props.state.db) {
        try {
          const docRef = await addDoc(collection(props.state.db, "users"), {
            name: creds.name,
            password: creds.password,
          });

          props.dispatch({
            type: ActionType.SetUserID,
            payload: docRef.id,
          });
          props.dispatch({
            type: ActionType.SetStageStart,
            payload: "",
          });
        } catch (e) {
          setTemporaryMessage("Rejestracja nie powiodła się");
        }
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
        display: props.state.stage === "register" ? "initial" : "none",
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

export default Register;
