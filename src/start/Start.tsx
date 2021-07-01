import React from "react";
import { FaBriefcase, FaMugHot, FaBed } from "react-icons/fa";

function Start() {
  const showMenu = () => {};

  return (
    <div>
      <FaBriefcase
        style={{ height: "100%", width: "15%", background: "yellow" }}
      />
      <FaMugHot
        style={{ height: "100%", width: "15%", background: "yellow" }}
      />
      <FaBed style={{ height: "100%", width: "15%", background: "yellow" }} />
    </div>
  );
}

export default Start;
