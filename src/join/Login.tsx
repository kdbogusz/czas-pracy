import React, { useState } from "react";
import { State, Action, ActionType } from "../common/reducer";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import "./login.css";
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import login from '../assets/img/login.svg'

const Login = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const [ promiseInProgress, setPromiseInProgress ] = useState(false);
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
        setPromiseInProgress(true);
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
              props.dispatch({
                type: ActionType.ShowNavBar,
                payload: true,
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
                if (!teamsQuerySnapshot.empty) {
                  teamsQuerySnapshot.forEach((team) => {
                    props.dispatch({
                      type: ActionType.SetTeamPasscode,
                      payload: team.data().passcode
                    });
                  })
                }
                setPromiseInProgress(false);
              })();
            }
          } else {
            setTemporaryMessage("Logowanie nie powiodło się");
            setPromiseInProgress(false);
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
      <div className="login-container__login">
        <h1>{t("signIn")}:</h1>
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
              className="miscButton--main miscButton--shadow login__button login-btn__login"
            >
              {t("signIn")}
            </button>
            <button
              type="button"
              onClick={cancelHandler}
              className="miscButton--cancel login__button "
            >
              {t("cancel")}
            </button>
          </div>
            {promiseInProgress && <Loader type="ThreeDots" color="#3498db" height="100" width="100" />}
          <h2 className={message === "" ? "login__message" : "login__message login__message--visible"}>{message}</h2>
      </div>
      <div className="login-container__img">
        <img src={login} alt="login"></img>
      </div>
    </div>
  );
};

export default Login;
