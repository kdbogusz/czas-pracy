import React from "react";
import { State, Action, ActionType } from "../common/reducer";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  getDoc,
  DocumentData,
} from "firebase/firestore";

import "./login.css";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import { useState } from "react";
import register from '../assets/img/register.svg'

const Register = (props: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const [promiseInProgress, setPromiseInProgress] = useState(false);
  const { t } = useTranslation();

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
    if (creds.password !== creds.passwordCheck || creds.name === "" || creds.password === "") {
      setTemporaryMessage("Rejestracja nie powiodła się");
      return;
    }

    (async () => {
      setPromiseInProgress(true)
      if (props.state.db) {
        try {
          const userQuery = query(
            collection(props.state.db, "users"),
            where("name", "==", creds.name));
          const teamQuerySnapshot = await getDocs(userQuery);
          if (teamQuerySnapshot.size === 0) {
            const docRef = await addDoc(collection(props.state.db, "users"), {
              name: creds.name,
              password: creds.password,
            })
            props.dispatch({
              type: ActionType.SetUserID,
              payload: docRef.id,
            });
            const docSnap = await getDoc(docRef);
            if (docSnap.data()) {
              if ((docSnap.data() as DocumentData).teamID) {
                props.dispatch({
                  type: ActionType.SetTeamID,
                  payload: (docSnap.data() as DocumentData).teamID,
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
            }
          } else {
            setMessage("Konto juz istnieje!")
          }
          setPromiseInProgress(false)
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

  const keyDownHandler = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      submitHandler(e);
    }
  }

  return (
    <div
      className="login"
      style={{
        display: props.state.stage === "register" ? "flex" : "none",
      }}
    >
      <div className="login-container__login">
        <h1>{t("register")}</h1>
        <form className="login__form" onSubmit={submitHandler} onKeyDown={keyDownHandler}>
          <div className="login__field">
            <label htmlFor="loginName" className="login__label">{t("userName")}:</label>
            <input
              type="text"
              id="loginName"
              name="loginName"
              className="login__input"
              value={creds.name}
              onChange={(e) => setCreds({ ...creds, name: e.target.value.split(/\s/).join('') })}
            ></input>
          </div>

          <div className="login__field">
            <label htmlFor="loginName" className="login__label">{t("password")}:</label>
            <input
              type="password"
              id="loginPassword"
              name="loginPassword"
              className="login__input"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value.split(/\s/).join('') })}
            ></input>
          </div>

          <div className="login__field">
            <label htmlFor="loginName" className="login__label">{t("repeatPassword")}:</label>
            <input
              type="password"
              id="loginPasswordCheck"
              name="loginPasswordCheck"
              className="login__input"
              value={creds.passwordCheck}
              onChange={(e) =>
                setCreds({ ...creds, passwordCheck: e.target.value.split(/\s/).join('') })
              }
            ></input>
          </div>
        </form>
        <div className="login__buttons">
          <button
            type="button"
            onClick={submitHandler}
            className="miscButton--main miscButton--shadow login__button login-btn__login">
            {t("submit")}
          </button>
          <button
            type="button"
            onClick={cancelHandler}
            className="miscButton--cancel login__button">
            {t("cancel")}
          </button>
        </div>
        {promiseInProgress && <Loader type="ThreeDots" color="#3498db" height="100" width="100" />}
        <p className={message === "" ? "login__message" : "login__message login__message--visible"}>{message}</p>
      </div>
      <div className="login-container__img">
        <img src={register} alt="register"></img>
      </div>
    </div>
  );
};

export default Register;
