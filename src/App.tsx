import React from 'react';
import './App.css';

import Navbar from "./common/Navbar";
import Menu from "./common/Menu";
import Start from "./start/Start";

function App() {
  return (
    <div className="App">
      <header>
        <Navbar />
        <Menu />
      </header>
      <div>
        <Start />
      </div>
    </div>
  );
}

export default App;
