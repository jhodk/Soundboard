import { useContext } from "react";
import { UserStylesContext, UserStylesContextType } from "../context/user-styles-context";

export const useUserStylesContext = (): UserStylesContextType => {
  const context = useContext(UserStylesContext);
  if(context === null) {
    throw new Error("User styles context used outside provider");
  }
  return context;
}