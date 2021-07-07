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

import "./login.css";

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

  const submitHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
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

  return (
    <div
      className="login"
      style={{
        display: props.state.stage === "register" ? "flex" : "none",
      }}
    >
    <h1>ZAREJESTRUJ SIĘ:</h1>
      <form className="login__form" onSubmit={submitHandler}>
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
              
        <button type="button" onClick={submitHandler} className="miscButton--main miscButton--shadow login__button">SUBMIT</button>
            </div>

      <h2 className={message === "" ? "login__message" : "login__message login__message--visible"}>{message}</h2>
    </div>
  );
};

export default Register;
