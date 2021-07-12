import React from "react";
import { State, Action } from "../common/reducer";
import './teamInfo.css'
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import "../start/start.css";
import "../common/common.css";
import moment from "moment";

type User = {
  name: string;
  time: number;
  timeString: string;
  totalTimeString: string;
};

const timeDiffString = (start: Date, end: Date) => {
  const timeDiff: number = end.getTime() - start.getTime();
  const dateDiff = new Date(timeDiff);
  const hourDiff = Math.floor(timeDiff / 1000 / 60 / 60);
  const minuteDiff = dateDiff.getUTCMinutes();
  return (
    (hourDiff < 10 ? "0" : "") +
    String(hourDiff) +
    ":" +
    (minuteDiff < 10 ? "0" : "") +
    String(minuteDiff)
  );
};

const TeamInfo = (props: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const [users, setUsers] = React.useState({});
  const [minutesPerDay, setMinutesPerDay] = React.useState(8 * 60);

  const getUsers = () => {
    (async () => {
      if (props.state.db) {
        const userQuery = query(
          collection(props.state.db, "users"),
          where("teamID", "==", props.state.teamID)
        );
        const userQuerySnapshot = await getDocs(userQuery);

        let newUsers = {};
        userQuerySnapshot.forEach((doc) => {
          newUsers = {
            ...newUsers,
            [doc.id]: {
              name: doc.data().name,
              time: 0,
              timeString: "",
              totalTimeString: totalWorkingMinutesInMonthDisplay(
                moment().toDate()
              ),
            },
          };
        });

        const timesQuery = query(
          collection(props.state.db, "work_blocks"),
          where("teamID", "==", props.state.teamID)
        );
        const timesQuerySnapshot = await getDocs(timesQuery);
        timesQuerySnapshot.forEach((doc) => {
          if (
            doc.data().start.toDate() < moment().toDate() &&
            doc.data().end.toDate() < moment().toDate()
          ) {
            (
              newUsers[doc.data().userID as keyof typeof newUsers] as User
            ).time +=
              doc.data().end.toDate().getTime() -
              doc.data().start.toDate().getTime();
          } else if (
            doc.data().start.toDate() < moment().toDate() &&
            doc.data().end.toDate() > moment().toDate()
          ) {
            (
              newUsers[doc.data().userID as keyof typeof newUsers] as User
            ).time +=
              moment().toDate().getTime() - doc.data().start.toDate().getTime();
          }
        });
        const vacationsQuery = query(
          collection(props.state.db, "vacations"),
          where("teamID", "==", props.state.teamID)
        );
        const vacationsQuerySnapshot = await getDocs(vacationsQuery);
        vacationsQuerySnapshot.forEach((doc) => {
          console.log("qa",(newUsers[doc.data().userID as keyof typeof newUsers] as User).totalTimeString);
            (
              newUsers[doc.data().userID as keyof typeof newUsers] as User
            ).totalTimeString =(parseInt((newUsers[doc.data().userID as keyof typeof newUsers] as User).totalTimeString.substr(0,3))-8).toString()+":00"
        });

        

        Object.keys(newUsers).forEach((newUserKey) => {
          (newUsers[newUserKey as keyof typeof newUsers] as User).timeString =
            timeDiffString(
              new Date(0),
              new Date(
                (newUsers[newUserKey as keyof typeof users] as User).time
              )
            );
        });

        setUsers(newUsers);
      }
    })();
  };

  const totalWorkingMinutesInMonth = (date: Date) => {
    let currentDate = date;
    currentDate = moment(currentDate)
      .add(-(date.getDate() - 1), "day")
      .toDate();

    let dayCounter = 0;
    while (currentDate.getMonth() === date.getMonth()) {
      if ([1, 2, 3, 4, 5].includes(currentDate.getDay())) {
        dayCounter++;
      }
      currentDate = moment(currentDate).add(1, "day").toDate();
    }

    // dayCounter -= totalVacationDaysInMonth(date);

    return dayCounter * minutesPerDay;
  };

  const totalWorkingMinutesInMonthDisplay = (date: Date) => {
    return timeDiffString(
      new Date(0),
      new Date(1000 * 60 * totalWorkingMinutesInMonth(date))
    );
  };

//   const totalVacationDaysInMonth = () => (async (date: Date) => {
//       if (props.state.db) {
//         const vacationQuery = query(
//           collection(props.state.db, "vacations"),
//           where("userID", "==", props.state.userID)
//         );
//         const vacationQuerySnapshot = await getDocs(vacationQuery);

//         let vacationDays = 0;

//         vacationQuerySnapshot.forEach((doc) => {
//             vacationDays++;
//         });
//         return vacationDays;
//       }
//       return 0;
//     })();

  React.useEffect(() => {
    getUsers();
  }, [props.state.stage]);

  return (
    <div className="teamInfo-container"
    //   className={
    //     props.state.stage === "team"
    //       ? "start start--layout"
    //       : "start start--hidden"
    //   }
    >
      <div>
        {props.state.isTeamLeader ? (
          <>
            <table className="teamInfo-table" width="100%" cellSpacing="0">
                    <caption>{`PASSCODE: ${props.state.teamPasscode}`}</caption>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Hours worked</th>
                            <th>All hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(users)
                          .reverse().map((key)=> <tr>
                            <td>
                              {(users[key as keyof typeof users] as User).name}
                            </td>
                            <td>
                              {(users[key as keyof typeof users] as User).timeString}
                            </td>
                            <td>
                            {
                        (users[key as keyof typeof users] as User)
                          .totalTimeString
                      }
                            </td>
                          </tr>)}
                    </tbody>
                </table>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TeamInfo;
