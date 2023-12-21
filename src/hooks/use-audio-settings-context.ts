import { useContext } from "react";
import { AudioSettingsContext, AudioSettingsContextType } from "../context/audio-settings-context"

export const useAudioSettingsContext = (): AudioSettingsContextType => {
  const context = useContext(AudioSettingsContext);
  if(context === null) {
    throw new Error("Audio settings context used outside provider");
  }
  return context;
}