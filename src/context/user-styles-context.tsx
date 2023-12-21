import { FC, ReactNode, createContext, useState } from "react";


export interface UserStylesContextType {
  buttonSize: number;
  buttonGap: number;
  updateButtonGap: (size: number) => void;
  updateButtonSize: (size: number) => void;
  showNames: boolean;
  updateShowNames: (show: boolean) => void;
  showEmojis: boolean;
  updateShowEmojis: (show: boolean) => void;
}


export const UserStylesContext = createContext<UserStylesContextType | null>(null);

export const UserStylesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [buttonSize, setButtonSize] = useState(parseInt(localStorage.getItem("button-size") ?? "10", 10)/10);
  const [buttonGap, setButtonGap] = useState(parseInt(localStorage.getItem("button-gap") ?? "1", 10)/10);
  const [showNames, setShowNames] = useState(localStorage.getItem("show-names") === "true")
  const [showEmojis, setShowEmojis] = useState(localStorage.getItem("show-emojis") === "true")

  const updateButtonSize = (size: number): void => {
    localStorage.setItem("button-size", size.toString());
    setButtonSize(size/10);
  }

  const updateButtonGap = (size: number): void => {
    localStorage.setItem("button-gap", size.toString());
    setButtonGap(size/10);
  }

  const updateShowNames = (show: boolean): void => {
    localStorage.setItem("show-names", show.toString());
    setShowNames(show);
  }

  const updateShowEmojis = (show: boolean): void => {
    localStorage.setItem("show-emojis", show.toString());
    setShowEmojis(show);
  }

  return (
    <UserStylesContext.Provider value={{
      buttonSize,
      buttonGap,
      updateButtonSize,
      updateButtonGap,
      showNames,
      updateShowNames,
      showEmojis,
      updateShowEmojis,
    }}>
      {children}
    </UserStylesContext.Provider>
  );
};