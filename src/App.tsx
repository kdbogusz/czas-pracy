import React from 'react';
import './App.css';

import Navbar from "./common/Navbar";
import Menu from "./common/Menu";
import Start from "./start/Start";
import { initialState, reducer } from './common/reducer';
import Calendar from './calendar/Calendar';
import Declarations from './declarations/Declarations';

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div className="App">
      <header>
        <Navbar state={state} dispatch={dispatch} />
        <Menu state={state} dispatch={dispatch} />
      </header>
      <div className="app__body">
        <Start state={state} dispatch={dispatch} />
        {state.stage === "calendar" && <Calendar state={state} dispatch={dispatch} />}
        <Declarations state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}

export default App;
