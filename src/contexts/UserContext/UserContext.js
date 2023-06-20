import { createContext } from "react";

const UserContext = createContext();
const SetUserContext = createContext(undefined);

export {UserContext, SetUserContext};