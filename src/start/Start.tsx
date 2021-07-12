import React from "react";
import { FaBriefcase, FaMugHot, FaBed } from "react-icons/fa";
import { State, Action } from "../common/reducer";
import {
  timeDiffString,
  removeOldEvents,
} from "../declarations/Declarations";
import work from '../assets/img/work.svg'

import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import "./start.css";
import "../common/common.css";
import moment from "moment";

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
    background: "#3498db",
    padding: "1.5rem 1.5rem 1.5rem 1.5rem",
    borderRadius: "5rem",
    color: "#ecf0f1"
  };

  const buttonStylePressed = {
    background: "#fff",
    padding: "1.5rem 1.5rem 1.5rem 1.5rem",
    borderRadius: "5rem",
    boxShadow: "0px 0px 10px 1px rgb(43, 33, 24, 0.4)",
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
  }, [stamps]);

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
    console.log(stamps)
    let lastStamp: Stamp | undefined;
    stamps.forEach((stamp) => {
      if (lastStamp === undefined && stamp.stampType !== StampType.Out) lastStamp = stamp;
      else if (lastStamp === undefined && stamp.stampType === StampType.Out) return;
      else if (stamp.stampType !== StampType.Out) return;
      else if (lastStamp !== undefined && stamp.stampType === StampType.Out) {
        const start = lastStamp.moment;
        const end = stamp.moment;
        addBlock(start, end);
        lastStamp = stamp;
      }
    });

    if (lastStamp !== undefined && lastStamp.stampType !== StampType.Out) {
      const start = lastStamp.moment;
      const end = moment().toDate();
      addBlock(start, end);
      console.log(start.toTimeString(), end.toTimeString())
    }
    setStamps([])
    setTimeElapsedWorkDisplay(timeElapsedWork([]));
    setTimeElapsedBreakDisplay(timeElapsedBreak([]));



  };

  return (
    <div
      className={
        props.state.stage === "start"
          ? "start start--layout"
          : "start start--hidden"
      }
    >

      <div className="start-container">
        <div className="start-hole"></div>
        <div className="start-container__timer">
          <FaBriefcase className="start-icon"
            style={pressed === StampType.Work ? buttonStylePressed : buttonStyle}
            onClick={workHandler}
          />
          <p>{timeElapsedWorkDisplay}</p>
        </div>
        <div className="start-container__timer">
          <FaMugHot className="start-icon"
            style={pressed === StampType.Break ? buttonStylePressed : buttonStyle}
            onClick={breakHandler}
          />
          <p>{timeElapsedBreakDisplay}</p>
        </div>
        <div className="start-container__timer">
          <FaBed className="start-icon"
            style={pressed === StampType.Out ? buttonStylePressed : buttonStyle}
            onClick={outHandler}
          />
          <p></p>
        </div>
        <button
        type="button"
        className="miscButton--main start-btn"
        onClick={submitHandler}
      >
        Submit
      </button>
      </div>
      <div className="start-container__img">
        <img src={work} alt="work"></img>
      </div>

    </div>
  );
};

export default Start;
