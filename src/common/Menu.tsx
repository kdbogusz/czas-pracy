import React from 'react';
import {State, Action, ActionType} from "./reducer";

import "./navbar.css";

import NavbarButton from './NavbarButton';

const Menu = (props: {state: State, dispatch: React.Dispatch<Action>}) => {
    const hideMenu = () => {
        props.dispatch({
            type: ActionType.HideMenu,
            payload: "",
        });
    };

    const setStartCallback = () => {
        props.dispatch({
            type: ActionType.SetStageStart,
            payload: "",
        });
        hideMenu();
    };

    const setCalendarCallback = () => {
        props.dispatch({
            type: ActionType.SetStageCalendar,
            payload: "",
        });
        hideMenu();
    };

    const setDeclerationsCallback = () => {
        props.dispatch({
            type: ActionType.SetStageDeclarations,
            payload: "",
        });
        hideMenu();
    }

    return (
        <div className="menu" style={{visibility: props.state.isMenuVisible ? "visible" : "hidden"}}>
            <NavbarButton text="START" callback={setStartCallback} />
            <NavbarButton text="KALENDARZ" callback={setCalendarCallback} />
            <NavbarButton text="DEKLARACJE" callback={setDeclerationsCallback} />
        </div>
    );
};
    
export default Menu;