import React, { createContext, useContext, useReducer } from "react";
import { Action, reducer } from "./reducer";
import { initialState, State } from "./store";

const ActivityContext = createContext<[State, React.Dispatch<Action>]>([initialState, () => null]);

const ActivityContextProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const value = useReducer(reducer, initialState);

    return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

const useActivity = (): [State, React.Dispatch<Action>] => useContext(ActivityContext);

export default ActivityContextProvider;
export { useActivity };
