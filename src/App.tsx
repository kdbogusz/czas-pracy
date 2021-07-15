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
import { useTranslation } from "react-i18next";
import { initialState, reducer, ActionType, State, viableStages } from "./common/reducer";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import moment from "moment";
import "moment/locale/en-gb";
import "moment/locale/pl";
import {
  useHistory,
  useLocation,
  BrowserRouter,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { t, i18n } = useTranslation();
  const lang =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
  moment.locale(lang);
  const history = useHistory();
  const location = useLocation();
  let routingState = "REST";
  // const [routingState, setRoutingState] = React.useState("REST");

  React.useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);

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

  React.useEffect(() => {
    console.log(state)
      console.log("LOCATION OUT", (location.state) ? (location.state as State).stage: "", location.pathname, state.stage, routingState)
      if (routingState === "REST"
      ){ 
      // && (
      //   location.pathname !== `/${state.stage}` || (
      // (location.state) && (location.state as State).stage !== state.stage))) {
      // if (routingState === "REST" && location.pathname !== `/${state.stage}`) {
        console.log("LOCATION IN", (location.state) ? (location.state as State).stage: "", location.pathname, state.stage, routingState)
        if (viableStages.includes(location.pathname.substring(1)) || location.pathname.substring(1) === "") {
          routingState = "LOCATION CHANGE";
          dispatch({
            type: ActionType.SetStageToString,
            payload:
              location.pathname.substring(1) === ""
                ? "join"
                : location.pathname.substring(1),
          });
          if (location.state) {
            dispatch({
              type: ActionType.SetState,
              payload: location.state as State,
            });
          } else
          location.state = {
            ...state,
            stage: location.pathname.substring(1) === ""
            ? "join"
            : location.pathname.substring(1),
            db: undefined,
            firebaseApp: undefined,
          };
        } else {
          location.pathname = "/"
        }
        
        console.log("LOCATION IN AFTER", (location.state) ? (location.state as State).stage: "", location.pathname, state.stage, routingState)
      } else routingState = "REST";
  }, [location]);

  React.useEffect(() => {
      console.log("STAGE OUT", (location.state) ? (location.state as State).stage: "", location.pathname, state.stage, routingState)
      if (
        routingState === "REST" && (
        location.pathname !== `/${state.stage}` || (
        (location.state) && (location.state as State).stage !== state.stage ))
      ) {
        console.log("STAGE IN", (location.state) ? (location.state as State).stage: "", location.pathname, state.stage, routingState)
        routingState = "STAGE CHANGE";
        history.push(`/${state.stage !== "join" ? state.stage : ""}`, {
          ...state,
          db: undefined,
          firebaseApp: undefined,
        });
        console.log("STAGE IN AFTER", (location.state) ? (location.state as State).stage: "", location.pathname, state.stage, routingState)
      } else routingState = "REST";
  }, [state.stage]);

  return (
    <div className="App">
      <header>
        <Navbar state={state} dispatch={dispatch} />
        <Menu state={state} dispatch={dispatch} />
      </header>

      <div className="app__body">
        <Switch>
          <Route path="/noTeam">
            <NoTeam state={state} dispatch={dispatch} />
          </Route>
          <Route path="/start">
            <Start state={state} dispatch={dispatch} />
          </Route>
          <Route path="/calendar">
            {//state.stage === "calendar" && (
              <Calendar state={state} dispatch={dispatch} />
            // )
          }
          </Route>
          <Route path="/declarations">
            <Declarations state={state} dispatch={dispatch} />
          </Route>
          <Route exact path="/login">
            <Login state={state} dispatch={dispatch} />
          </Route>
          <Route path="/register">
            <Register state={state} dispatch={dispatch} />
          </Route>
          <Route path="/team">
            <Team state={state} dispatch={dispatch} />
          </Route>
          <Route path="/">
            <Join state={state} dispatch={dispatch} />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;
