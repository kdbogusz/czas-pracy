import React, { HTMLAttributes, SyntheticEvent } from "react";
import { State, Action, ActionType } from "../common/reducer";
import {
  Calendar,
  EventPropGetter,
  momentLocalizer,
  stringOrDate,
} from "react-big-calendar";
import moment from "moment";
import DatePicker, { CalendarContainer } from "react-datepicker";
import TimePicker from "rc-time-picker";
import Popup from "reactjs-popup";

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
  const [events, setEvents] = React.useState({});
  const [isPopUpOpen, setIsPopUpOpen] = React.useState(false);
  const [popUpPosition, setPopUpPosition] = React.useState({ x: 0, y: 0 });
  const [selected, setSelected] = React.useState<eventInfo>();

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

  const getEvents = () =>
    (async () => {
      if (props.state.db) {
        const q = query(
          collection(props.state.db, "work_blocks"),
          where("userID", "==", props.state.userID)
        );
        const querySnapshot = await getDocs(q);

        let newEvents = {};

        querySnapshot.forEach((doc) => {
          newEvents = {
            ...newEvents,
            [doc.data().start.toDate().toDateString()]: {
              title: timeDiffString(
                doc.data().start.toDate(),
                doc.data().end.toDate()
              ),
              allDay: false,
              start: doc.data().start.toDate(),
              end: doc.data().end.toDate(),
            },
          };
        });
        setEvents(newEvents);
      }
    })();

  const setTemporaryEvent = () => {
    if (formInfo.start !== formInfo.end) {
      const temporaryEvent: eventInfo = {
        title: timeDiffString(formInfo.start, formInfo.end),
        allDay: false,
        start: formInfo.start,
        end: formInfo.end,
      };

      setEvents({
        ...events,
        ["tmp"]: temporaryEvent,
      });
    }
  };

  React.useEffect(() => {
    setTemporaryEvent();
  }, [formInfo]);

  React.useEffect(() => {
    getEvents();
  }, [props.state.stage]);

  const addEvent = () => {
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
          getEvents();
        }
      })();
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

  const deleteHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    (async () => {
      if (props.state.db && selected) {
        const q = query(
          collection(props.state.db, "work_blocks"),
          where("start", "==", Timestamp.fromDate(selected.start))
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((block) => {
          (async () => {
            if (props.state.db) {
              const blockRef = block.ref;
              await deleteDoc(blockRef);
            }
          })();
        });
        getEvents();
        setIsPopUpOpen(false);
      }
    })();
  };

  const eventPropGetter = (
    event: eventInfo,
    start: stringOrDate,
    end: stringOrDate,
    isSelected: boolean
  ) => {
    if (event === events["tmp" as keyof typeof events]) {
      return { style: { background: "rgba(50, 50, 50, 0.65)" } };
    }
    return { style: { background: "blue" } };
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
      <div
        style={{ zIndex: 100, height: "90%" }}
        onClick={(e) => {
          setPopUpPosition({ x: e.pageX, y: e.pageY });
        }}
      >
        <Calendar
          eventPropGetter={(event, start, end, isSelected) =>
            eventPropGetter(event, start, end, isSelected)
          }
          selectable={true}
          onSelectSlot={onSelectSlot}
          onSelectEvent={(event: eventInfo, e: SyntheticEvent) => {
            setSelected(event);
            setTimeout(() => setIsPopUpOpen(true), 0);
          }}
          localizer={localizer}
          events={Object.keys(events).map(
            (key) => events[key as keyof typeof events]
          )}
          step={60}
          defaultView="week"
          views={["week", "month"]}
          defaultDate={moment().toDate()}
          style={{ height: "100%" }}
          startAccessor="start"
          endAccessor="end"
        />
        <Popup
          open={isPopUpOpen}
          closeOnDocumentClick
          onClose={() => {
            setIsPopUpOpen(false);
          }}
          contentStyle={{
            padding: "20px",
            background: "red",
            position: "fixed",
            left: popUpPosition.x,
            top: popUpPosition.y,
          }}
        >
          <button type="button" onClick={deleteHandler}>
            DELETE
          </button>
        </Popup>
      </div>
    </div>
  );
};

export default Declarations;
