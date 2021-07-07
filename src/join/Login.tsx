import React, { FormEventHandler, MouseEventHandler } from "react";
import { State, Action, ActionType } from "../common/reducer";

import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import "./login.css";

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

  const submitHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>
  ) => {
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
            if (doc.data().teamID) {
              props.dispatch({
                type: ActionType.SetTeamID,
                payload: doc.data().teamID,
              });
              props.dispatch({
                type: ActionType.SetStageStart,
                payload: "",
              });
            } else {
              props.dispatch({
                type: ActionType.SetStageNoTeam,
                payload: "",
              });
            }
            if (props.state.db) {
              const teamsQuery = query(
                collection(props.state.db, "teams"),
                where("leaderID", "==", doc.id)
              );
              (async () => {
                const teamsQuerySnapshot = await getDocs(teamsQuery);
                props.dispatch({
                  type: ActionType.SetIsTeamLeader,
                  payload: !teamsQuerySnapshot.empty,
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

  const cancelHandler = () => {
    props.dispatch({
      type: ActionType.SetStageJoin,
      payload: "",
    });
  }

  React.useEffect(() => {
    setCreds({ name: "", password: "", passwordCheck: "" });
    setMessage("");
  }, [props.state.stage]);

  const keyDownHandler = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      submitHandler(e);
    }
  }

  return (
    <div
      className="login"
      style={{
        display: props.state.stage === "login" ? "flex" : "none",
      }}
    >
    <h1>ZALOGUJ SIĘ:</h1>
      <form className="login__form" onSubmit={submitHandler} onKeyDown={keyDownHandler}>
        <div className="login__field">
          <label htmlFor="loginName" className="login__label">Nazwa użytkownika:</label>
          <input
            type="text"
            id="loginName"
            name="loginName"
            className="login__input"
            value={creds.name}
            onChange={(e) => setCreds({ ...creds, name: e.target.value })}
          ></input>
        </div>

        <div className="login__field">
          <label htmlFor="loginName" className="login__label">Hasło:</label>
          <input
            type="password"
            id="loginPassword"
            name="loginPassword"
            className="login__input"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          ></input>
        </div>

        <div className="login__field">
          <label htmlFor="loginName" className="login__label">Powtórz hasło:</label>
          <input
            type="password"
            id="loginPasswordCheck"
            name="loginPasswordCheck"
            className="login__input"
            value={creds.passwordCheck}
            onChange={(e) =>
              setCreds({ ...creds, passwordCheck: e.target.value })
            }
          ></input>
        </div>
      </form>
      <div className="login__buttons">
        <button
          type="button"
          onClick={cancelHandler}
          className="miscButton--cancel miscButton--shadow login__button"
        >
          ANULUJ
        </button>
        <button
          type="button"
          onClick={submitHandler}
          className="miscButton--main miscButton--shadow login__button"
        >
          ZALOGUJ
        </button>
      </div>

      <h2 className={message === "" ? "login__message" : "login__message login__message--visible"}>{message}</h2>
    </div>
  );
};

export default Login;
