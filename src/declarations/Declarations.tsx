import React from "react";
import { State, Action, ActionType } from "../common/reducer";
import { Calendar, momentLocalizer, stringOrDate } from "react-big-calendar";
import moment from "moment";
import DatePicker, { CalendarContainer } from "react-datepicker";
import TimePicker from "rc-time-picker";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-time-picker/assets/index.css";
import "../common/common.css";
import "./declarations.css";

type slotInfo = {
  start: stringOrDate;
  end: stringOrDate;
};

type eventInfo = {
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
};

const Declarations = (props: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const [formInfo, setFormInfo] = React.useState({
    day: new Date(),
    start: new Date(),
    end: new Date(),
  });

  const [eventsMock, setEventsMock] = React.useState({});

  moment.locale("en-GB");
  const localizer = momentLocalizer(moment);

  const timeDiffString = (start: Date, end: Date) => {
    const timeDiff: number = end.getTime() - start.getTime();
    const dateDiff = new Date(timeDiff);
    const hourDiff = dateDiff.getUTCHours();
    const minuteDiff = dateDiff.getUTCMinutes();
    return (
      (hourDiff < 10 ? "0" : "") +
      String(hourDiff) +
      ":" +
      (minuteDiff < 10 ? "0" : "") +
      String(minuteDiff)
    );
  };

  const addEvent = () => {
    // const start: Date = formInfo.start;
    const start: Date = new Date(
      formInfo.day.getFullYear(),
      formInfo.day.getMonth(),
      formInfo.day.getDate(),
      formInfo.start.getHours(),
      formInfo.start.getMinutes(),
      formInfo.start.getSeconds(),
      formInfo.start.getMilliseconds()
    );
    const end: Date = new Date(
      formInfo.day.getFullYear(),
      formInfo.day.getMonth(),
      formInfo.day.getDate(),
      formInfo.end.getHours(),
      formInfo.end.getMinutes(),
      formInfo.end.getSeconds(),
      formInfo.end.getMilliseconds()
    );
    // const end: Date = formInfo.end;
    // start.setUTCFullYear(formInfo.day.getUTCFullYear(), formInfo.day.getUTCMonth(), formInfo.day.getUTCDay())
    // end.setUTCFullYear(formInfo.day.getUTCFullYear(), formInfo.day.getUTCMonth(), formInfo.day.getUTCDay())
    const newEvent: eventInfo = {
      title: timeDiffString(start, end),
      allDay: false,
      start: start,
      end: end,
    };

    if (timeDiffString(start, end) !== "00:00") {
      setEventsMock({ ...eventsMock, [start.toDateString()]: newEvent });
    }
  };

  const onSelectSlot = (e: slotInfo) => {
    const startDate: Date = new Date(e.start);
    const endDate: Date = new Date(e.end);
    setFormInfo({
      day: startDate,
      start: startDate,
      end: endDate,
    });
    return true;
  };

  return (
    <div
      style={{
        display: props.state.stage === "declarations" ? "initial" : "none",
        height: "100%",
      }}
    >
      <div style={{ zIndex: 90000 }}>
        <DatePicker
          selected={formInfo.day}
          onChange={(date) => {
            setFormInfo({ ...formInfo, day: date as Date });
          }}
        />
        <TimePicker
          showSecond={false}
          value={moment(formInfo.start)}
          onChange={(moment) => {
            setFormInfo({ ...formInfo, start: moment.toDate() });
          }}
          format={"hh:mm a"}
          use12Hours
          inputReadOnly
        />
        <TimePicker
          showSecond={false}
          value={moment(formInfo.end)}
          onChange={(moment) => {
            setFormInfo({ ...formInfo, end: moment.toDate() });
          }}
          format={"hh:mm a"}
          use12Hours
          inputReadOnly
        />
        <button type="button" onClick={addEvent}>
          SUBMIT
        </button>
      </div>
      {/* <form>
      <label htmlFor=""></label>
      <input
        type="text"
        id="logInName"
        name="logInName"
        value={creds.username}
        onChange={(e) => setCreds({ ...creds, username: e.target.value })}></input>
    </form> */}
      <div style={{ zIndex: 100, height: "90%" }}>
        <Calendar
          selectable={true}
          onSelectSlot={onSelectSlot}
          localizer={localizer}
          events={Object.keys(eventsMock).map(
            (key) => eventsMock[key as keyof typeof eventsMock]
          )}
          step={60}
          defaultView="week"
          views={["week", "month"]}
          defaultDate={moment().toDate()}
          style={{ height: "100%" }}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
    </div>
  );
};

export default Declarations;
