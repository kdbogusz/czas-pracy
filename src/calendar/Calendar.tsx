import React from "react";
import Timeline, {TimelineHeaders, DateHeader} from "react-calendar-timeline";
import moment from "moment";
import {State, Action, ActionType} from "../common/reducer";

import "react-calendar-timeline/lib/Timeline.css";
import "./calendar.css";
import "../common/common.css";

const Calendar = (props: {state: State, dispatch: React.Dispatch<Action>}) => {
  const groups = [
    { id: 1, title: "group 1" },
    { id: 2, title: "group 2" },
  ];

  const items = [
    {
      id: 1,
      group: 1,
      title: "",
      start_time: moment(),
      end_time: moment().add(1, "hour"),
    },
    {
      id: 2,
      group: 2,
      title: "",
      start_time: moment().add(-1, "hour"),
      end_time: moment().add(7, "hour"),
    },
    {
      id: 3,
      group: 1,
      title: "",
      start_time: moment().add(2, "hour"),
      end_time: moment().add(3, "hour"),
    },
  ];

  return (
    <div className="calendar" style={{display: props.state.stage === "calendar" ? "initial" : "none"}}>
      <Timeline
      lineHeight={60}
      itemHeightRatio={0.85}
      sidebarWidth={100}
      traditionalZoom={true}
        canResize={false}
        canMove={false}
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, "hour")}
        defaultTimeEnd={moment().add(12, "hour")}
      />
    </div>
  );
};

export default Calendar;
