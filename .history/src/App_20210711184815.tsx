import React from "react";
import "./App.css";

import Navbar from "./common/Navbar";
import Menu from "./common/Menu";
import Start from "./start/Start";
import Calendar from "./calendar/Calendar";
import Declarations from "./declarations/Declarations";
import Join from "./join/Join";
import Login from "./join/Login";
import Register from "./join/Register";
import NoTeam from "./team/NoTeam";
import Team from "./team/Team";

import { initialState, reducer } from "./common/reducer";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { FirebaseFirestore, getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    state.firebaseApp = !getApps().length
      ? initializeApp({
          apiKey: "AIzaSyDqUy4xsFcEEpv0VU5cAfWub2AjdDr4Iek",
          authDomain: "czas-pracy-d35c9.firebaseapp.com",
          projectId: "czas-pracy-d35c9",
          storageBucket: "czas-pracy-d35c9.appspot.com",
          messagingSenderId: "26978114858",
          appId: "1:26978114858:web:908c8893038bb541129253",
          measurementId: "G-1PYTW1W0L4",
        })
      : getApp();

    state.db = getFirestore();
  }, []);

  return (
    <div className={state.showNavBar ? "App": "main-page"}>
      {state.showNavBar && <header>
        <Navbar state={state} dispatch={dispatch} />
        <Menu state={state} dispatch={dispatch} />
      </header>}

      <div className="app__body">
        <NoTeam state={state} dispatch={dispatch} />
        <Start state={state} dispatch={dispatch} />
        {state.stage === "calendar" && (
          <Calendar state={state} dispatch={dispatch} />
        )}
        <Declarations state={state} dispatch={dispatch} />
        <Join state={state} dispatch={dispatch} />
        <Login state={state} dispatch={dispatch} />
        <Register state={state} dispatch={dispatch} />
        <Team state={state} dispatch={dispatch} />
      </div>
    </div>
  );
};

export default App;
