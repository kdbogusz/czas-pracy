import { FirebaseApp } from "firebase/app";
import { FirebaseFirestore } from "firebase/firestore";

export type State = {
  stage: string;
  isMenuVisible: boolean;
  firebaseApp: undefined | FirebaseApp;
  db: undefined | FirebaseFirestore;
  userID: string;
  teamID: string;
  isTeamLeader: boolean;
  teamPasscode: string;
  ShowNavBar: boolean
};

export enum ActionType {
  ShowNavBar= "SHOW_NAVBAR",
  HideMenu = "HIDE_MENU",
  ShowMenu = "SHOW_MENU",
  SetStageStart = "SET_STAGE_START",
  SetStageCalendar = "SET_STAGE_CALENDAR",
  SetStageDeclarations = "SET_STAGE_DECLARATIONS",
  SetStageJoin = "SET_STAGE_JOIN",
  SetStageLogin = "SET_STAGE_LOGIN",
  SetStageRegister = "SET_STAGE_REGISTER",
  SetStageNoTeam = "SET_STAGE_NO_TEAM",
  SetStageTeam = "SET_STAGE_TEAM",
  SetFirebaseApp = "SET_FIREBASE_APP",
  SetDB = "SET_DB",
  SetUserID = "SET_USER_ID",
  SetTeamID = "SET_TEAM_ID",
  SetIsTeamLeader = "SET_IS_TEAM_LEADER",
  SetTeamPasscode = "SET_TEAM_PASSCODE",
}

export type Action = {
  type: ActionType;
  payload: string | boolean | FirebaseApp | FirebaseFirestore;
};

export const initialState: State = {
  stage: "join",
  isMenuVisible: false,
  firebaseApp: undefined,
  db: undefined,
  userID: "",
  teamID: "",
  isTeamLeader: false,
  teamPasscode: "",
  ShowNavBar: false
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.SetStageStart:
      return {
        ...state,
        stage: "start",
      };
    case ActionType.SetStageCalendar:
      return {
        ...state,
        stage: "calendar",
      };
    case ActionType.SetStageDeclarations:
      return {
        ...state,
        stage: "declarations",
      };
    case ActionType.SetStageJoin:
      return {
        ...state,
        stage: "join",
      };
    case ActionType.SetStageLogin:
      return {
        ...state,
        stage: "login",
      };
    case ActionType.SetStageRegister:
      return {
        ...state,
        stage: "register",
      };
    case ActionType.SetStageNoTeam:
      return {
        ...state,
        stage: "noTeam",
      };
    case ActionType.SetStageTeam:
      return {
        ...state,
        stage: "team",
      };
    case ActionType.HideMenu:
      return {
        ...state,
        isMenuVisible: false,
      };
    case ActionType.ShowMenu:
      return {
        ...state,
        isMenuVisible: true,
      };
    case ActionType.SetFirebaseApp:
      return {
        ...state,
        firebaseApp: action.payload as FirebaseApp,
      };
    case ActionType.SetDB:
      return {
        ...state,
        db: action.payload as FirebaseFirestore,
      };
    case ActionType.SetUserID:
      return {
        ...state,
        userID: action.payload as string,
      };
    case ActionType.SetTeamID:
      return {
        ...state,
        teamID: action.payload as string,
      };
    case ActionType.SetIsTeamLeader:
      return {
        ...state,
        isTeamLeader: action.payload as boolean,
      };
    case ActionType.SetTeamPasscode:
      return {
        ...state,
        teamPasscode: action.payload as string,
      };
       case ActionType.SetTeamPasscode:
      return {
        ...state,
        teamPasscode: action.payload as string,
      };
      case ActionType.ShowNavBar:
        return {
          ...state,
          ShowNavBar: action.payload as boolean,
        };
    default:
      return state;
  }
}
