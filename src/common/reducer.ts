export type State = {
  stage: String;
  isMenuVisible: boolean;
};

export enum ActionType {
  HideMenu = "HIDE_MENU",
  ShowMenu = "SHOW_MENU",
  SetStageStart = "SET_STAGE_START",
  SetStageCalendar = "SET_STAGE_CALENDAR",
  SetStageDeclarations = "SET_STAGE_DECLARATIONS",
}

export type Action = {
  type: ActionType;
  payload: String;
};

export const initialState: State = {
  stage: "start",
  isMenuVisible: false,
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
    default:
      return state;
  }
}
