import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalStateProvider";

export const useGlobalState = () => useContext(GlobalContext);
