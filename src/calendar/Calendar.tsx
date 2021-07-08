import React from "react";
import Timeline, {
  TimelineHeaders,
  DateHeader,
  TimelineContext,
} from "react-calendar-timeline";
import moment, { Moment } from "moment";
import { State, Action, ActionType } from "../common/reducer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "react-calendar-timeline/lib/Timeline.css";
import "./calendar.css";
import "../common/common.css";

import {
  collection,
  documentId,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { groupEnd } from "console";

type singleItem = {
  id: number;
  group: number;
  title: string;
  start_time: Moment;
  end_time: Moment;
  itemProps: {
    style: {
      background: string;
      boxShadow: string;
    };
  };
};

type singleGroup = {
  id: number;
  title: string;
};

const Calendar = (props: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const [groups, setGroups] = React.useState<singleGroup[]>([]);
  const [items, setItems] = React.useState<singleItem[]>([]);
  const [isNamesVisible, setIsNamesVisible] = React.useState(false);

  const getItems = () =>
    (async () => {
      if (props.state.db) {
        const userQuery = query(
          collection(props.state.db, "users"),
          where("teamID", "==", props.state.teamID)
        );
        const userQuerySnapshot = await getDocs(userQuery);

        let users = {};
        let newGroups: singleGroup[] = [];
        userQuerySnapshot.forEach((doc) => {
          users = { ...users, [doc.id]: newGroups.length + 1 };
          newGroups = [
            { id: newGroups.length + 1, title: doc.data().name },
            ...newGroups,
          ];
        });
        setGroups(newGroups);

        const blockQuery = query(
          collection(props.state.db, "work_blocks"),
          where("teamID", "==", props.state.teamID)
        );
        const blockQuerySnapshot = await getDocs(blockQuery);

        let newItems: singleItem[] = [];
        blockQuerySnapshot.forEach((doc) => {
          newItems = [
            ...newItems,
            {
              id: newItems.length + 1,
              group: users[doc.data().userID as keyof typeof users],
              title: "",
              start_time: moment(doc.data().start.toDate()),
              end_time: moment(doc.data().end.toDate()),
              itemProps: {
                style: {
                  background: "#3066BE",
                  boxShadow: "none",
                },
              },
            },
          ];
        });
        setItems(newItems);
      }
    })();

  React.useEffect(() => {
    getItems();
    if (props.state.stage === "calendar" && !isNamesVisible) {
      setIsNamesVisible(true);
    }
  }, [props.state.stage]);

  // const getPasscode = () => {
  //   (async () => {
  //     if (props.state.db) {
  //       const userRef = doc(props.state.db, "teams", props.state.teamID);
  //       userRef.
  //     }
  //   })();
  // };

  return (
    <div
      // className={isNamesVisible ? "calendar" : "calendar--noNames"}

      className={"calendar"}
      style={{ display: props.state.stage === "calendar" ? "initial" : "none" }}
    >
      {isNamesVisible ? (
        <FaChevronLeft
          className="calendar__button"
          onClick={() => {
            setIsNamesVisible(!isNamesVisible);
          }}
        />
      ) : (
        <FaChevronRight
          className="calendar__button"
          onClick={() => {
            setIsNamesVisible(!isNamesVisible);
          }}
        />
      )}
      {/* {props.state.isTeamLeader ? getPasscode() : ""} */}
      <Timeline
        lineHeight={60}
        itemHeightRatio={0.85}
        sidebarWidth={isNamesVisible ? 100 : 0}
        traditionalZoom={false}
        canResize={false}
        canMove={false}
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-4, "day")}
        defaultTimeEnd={moment().add(4, "day")}
        onItemSelect={() => {}}
        minZoom={24 * 60 * 60 * 1000}
      />
    </div>
  );
};

export default Calendar;
