import React from "react";
import { FaBriefcase, FaMugHot, FaBed } from "react-icons/fa";
import { State, Action, ActionType } from "../common/reducer";
import {
  timeDiffString,
  removeOldEvents,
  EventInfo,
} from "../declarations/Declarations";

import {
  collection,
  documentId,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";

import "./start.css";
import "../common/common.css";
import moment, { now } from "moment";

enum StampType {
  Work = "work",
  Break = "break",
  Out = "out",
}

type Stamp = {
  stampType: StampType;
  moment: Date;
};

const Start = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
  const [pressed, setPressed] = React.useState(StampType.Out);
  const [stamps, setStamps] = React.useState<Stamp[]>([]);
  const [timeElapsedWorkDisplay, setTimeElapsedWorkDisplay] =
    React.useState("");
  const [timeElapsedBreakDisplay, setTimeElapsedBreakDisplay] =
    React.useState("");
  moment.locale("en-GB");

  const buttonStyle = {
    height: "20vw",
    width: "20vw",
    background: "#F08700",
    padding: "1.5rem 1.5rem 1.5rem 1.5rem",
    borderRadius: "3rem",
    boxShadow: "0px 0px 10px 1px rgb(43, 33, 24, 0.4)",
  };

  const buttonStylePressed = {
    height: "20vw",
    width: "20vw",
    background: "#A35C00",
    padding: "1.5rem 1.5rem 1.5rem 1.5rem",
    borderRadius: "3rem",
    boxShadow: "0px 0px 10px 1px rgb(163, 53, 0, 0.8)",
  };

  const workHandler = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();
    if (pressed !== StampType.Work) {
      setStamps([
        ...stamps,
        {
          stampType: StampType.Work,
          moment: moment().toDate(),
        },
      ]);
    }
    console.log(moment().toDate());
    setPressed(StampType.Work);
  };

  const breakHandler = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();
    if (pressed !== StampType.Break) {
      setStamps([
        ...stamps,
        {
          stampType: StampType.Break,
          moment: moment().toDate(),
        },
      ]);
    }
    setPressed(StampType.Break);
  };

  const outHandler = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();
    if (pressed !== StampType.Out) {
      setStamps([
        ...stamps,
        {
          stampType: StampType.Out,
          moment: moment().toDate(),
        },
      ]);
    }
    setPressed(StampType.Out);
  };

  const timeElapsedWork = (stamps: Stamp[]) => {
    let totalTime = 0;
    let lastStamp: Stamp | undefined = undefined;
    stamps.forEach((stamp) => {
      if (!lastStamp && stamp.stampType !== StampType.Work) return;
      if (!lastStamp) {
        lastStamp = stamp;
      }
      if (
        stamp.stampType === StampType.Work &&
        lastStamp.stampType !== StampType.Work
      ) {
        lastStamp = stamp;
      }
      if (
        stamp.stampType !== StampType.Work &&
        lastStamp.stampType === StampType.Work
      ) {
        totalTime += stamp.moment.getTime() - lastStamp.moment.getTime();
        lastStamp = stamp;
      }
    });
    if (lastStamp) {
      if (
        (lastStamp as Stamp).stampType &&
        (lastStamp as Stamp).stampType === StampType.Work
      ) {
        totalTime +=
          moment().toDate().getTime() - (lastStamp as Stamp).moment.getTime();
      }
    }
    const totalTimeDate = new Date(totalTime);

    return `${
      totalTimeDate.getUTCHours() < 10 ? "0" : ""
    }${totalTimeDate.getUTCHours()}${
      totalTimeDate.getUTCMinutes() < 10 ? ":0" : ":"
    }${totalTimeDate.getUTCMinutes()}${
      totalTimeDate.getUTCSeconds() < 10 ? ":0" : ":"
    }${totalTimeDate.getUTCSeconds()}`;
  };

  const timeElapsedBreak = (stamps: Stamp[]) => {
    let totalTime = 0;
    let lastStamp: Stamp | undefined = undefined;
    stamps.forEach((stamp) => {
      if (!lastStamp && stamp.stampType !== StampType.Break) return;
      if (!lastStamp) {
        lastStamp = stamp;
      }
      if (
        stamp.stampType === StampType.Break &&
        lastStamp.stampType !== StampType.Break
      ) {
        lastStamp = stamp;
      }
      if (
        stamp.stampType !== StampType.Break &&
        lastStamp.stampType === StampType.Break
      ) {
        totalTime += stamp.moment.getTime() - lastStamp.moment.getTime();
        lastStamp = stamp;
      }
    });
    if (lastStamp) {
      if (
        (lastStamp as Stamp).stampType &&
        (lastStamp as Stamp).stampType === StampType.Break
      ) {
        totalTime +=
          moment().toDate().getTime() - (lastStamp as Stamp).moment.getTime();
      }
    }
    const totalTimeDate = new Date(totalTime);

    return `${
      totalTimeDate.getUTCHours() < 10 ? "0" : ""
    }${totalTimeDate.getUTCHours()}${
      totalTimeDate.getUTCMinutes() < 10 ? ":0" : ":"
    }${totalTimeDate.getUTCMinutes()}${
      totalTimeDate.getUTCSeconds() < 10 ? ":0" : ":"
    }${totalTimeDate.getUTCSeconds()}`;
  };

  React.useEffect(() => {
    setTimeElapsedWorkDisplay(timeElapsedWork(stamps));
    const interval = setInterval(() => {
      setTimeElapsedWorkDisplay(timeElapsedWork(stamps));
      setTimeElapsedBreakDisplay(timeElapsedBreak(stamps));
    }, 1000);
    return () => clearInterval(interval);
  }, [pressed]);

  React.useEffect(() => {
    if (["join", "login", "register"].includes(props.state.stage)) {
      setPressed(StampType.Out);
      setStamps([]);
      setTimeElapsedWorkDisplay("");
      setTimeElapsedBreakDisplay("");
    }
  }, [props.state.stage])

  const addBlock = (start: Date, end: Date) => {
    if (timeDiffString(start, end) !== "00:00") {
      (async () => {
        if (props.state.db) {
          const docRef = await addDoc(
            collection(props.state.db, "work_blocks"),
            {
              start: Timestamp.fromDate(start),
              end: Timestamp.fromDate(end),
              userID: props.state.userID,
              teamID: props.state.teamID,
            }
          );
          removeOldEvents(
            {
              title: "",
              allDay: false,
              start: start,
              end: end,
            },
            docRef.id,
            props.state.userID,
            props.state.db
          );
        }
      })();
    }
  };

  const submitHandler = () => {
    let lastStamp: Stamp;
    stamps.forEach((stamp) => {
      if (!lastStamp && stamp.stampType !== StampType.Out) lastStamp = stamp;
      else if (!lastStamp && stamp.stampType === StampType.Out) return;
      else if (stamp.stampType !== StampType.Out) return;
      else if (stamp.stampType === StampType.Out) {
        const start = lastStamp.moment;
        const end = stamp.moment;
        addBlock(start, end);
        lastStamp = stamp;
      }
    });
  };

  return (
    <div
      className={
        props.state.stage === "start"
          ? "start start--layout"
          : "start start--hidden"
      }
    >
      <FaBriefcase
        style={pressed === StampType.Work ? buttonStylePressed : buttonStyle}
        onClick={workHandler}
      />
      {timeElapsedWorkDisplay}
      <FaMugHot
        style={pressed === StampType.Break ? buttonStylePressed : buttonStyle}
        onClick={breakHandler}
      />
      {timeElapsedBreakDisplay}
      <FaBed
        style={pressed === StampType.Out ? buttonStylePressed : buttonStyle}
        onClick={outHandler}
      />
      <button
        type="button"
        className="miscButton--main"
        onClick={submitHandler}
      >
        SUBMIT
      </button>
    </div>
  );
};

export default Start;
