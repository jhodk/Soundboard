import { FC, ReactNode, createContext, useState } from "react";
import { PlaybackType } from "../hooks/use-play-audio";
import { AudioManager } from "../utils/audio-manager";

export interface AudioSettingsContextType {
  previewDeviceId: string;
  broadcastDeviceId: string;
  updatePreviewDevice: (id: string) => void;
  updateBroadcastDevice: (id: string) => void;
  updatePreviewVolume: (volume: number) => void;
  updateBroadcastVolume: (volume: number) => void;
  previewVolume: number;
  broadcastVolume: number;
  addSound: (sound: ExtendedAudioElement, type: PlaybackType, id: string ) => void;
  playbackDelay: number;
  updatePlaybackDelay: (delay: number) => void;
  removeSound: (id: string) => void;
  removeSounds: () => void;
}

export interface PlayedAudio {
  id: string;
  type: PlaybackType;
  audio: ExtendedAudioElement;
}


export const AudioSettingsContext = createContext<AudioSettingsContextType | null>(null);

export const AudioSettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [previewDeviceId, setPreviewDeviceId] = useState(localStorage.getItem("preview-device") ?? "");
  const [broadcastDeviceId, setBroadcastDeviceId] = useState(localStorage.getItem("broadcast-device") ?? "");
  const [previewVolume, setPreviewVolume] = useState(parseInt(localStorage.getItem("preview-volume") ?? "50", 10));
  const [broadcastVolume, setBroadcastVolume] = useState(parseInt(localStorage.getItem("broadcast-volume") ?? "50", 10));
  const [playbackDelay, setPlaybackDelay] = useState(parseInt(localStorage.getItem("playback-delay") ?? "0", 10))

  const updatePreviewDevice = (id: string): void => {
    localStorage.setItem("preview-device", id);
    setPreviewDeviceId(id);
  }

  const updateBroadcastDevice = (id: string): void => {
    localStorage.setItem("broadcast-device", id);
    setBroadcastDeviceId(id);
  }

  const updatePreviewVolume = (volume: number): void => {
    localStorage.setItem("preview-volume", volume.toString());
    setPreviewVolume(volume);
    AudioManager.updateVolumes("preview", volume);
  }

  const updateBroadcastVolume = (volume: number): void => {
    localStorage.setItem("broadcast-volume", volume.toString());
    setBroadcastVolume(volume);
    AudioManager.updateVolumes("broadcast", volume);
  }

  const addSound = (sound: ExtendedAudioElement, type: PlaybackType, id: string): void => {
    AudioManager.addSound({audio: sound, type, id});
  }

  const removeSound = (id: string): void => {
    AudioManager.removeSound(id);
  }

  const removeSounds = (): void => {
    AudioManager.removeSounds();
  }

  const updatePlaybackDelay = (delay: number): void => {
    localStorage.setItem("playback-delay", delay.toString());
    setPlaybackDelay(delay);
  }

  return (
    <AudioSettingsContext.Provider value={{
      previewDeviceId,
      broadcastDeviceId,
      updatePreviewDevice,
      updateBroadcastDevice,
      updatePreviewVolume,
      updateBroadcastVolume,
      previewVolume,
      broadcastVolume,
      addSound,
      removeSound,
      removeSounds,
      playbackDelay,
      updatePlaybackDelay
    }}>
      {children}
    </AudioSettingsContext.Provider>
  );
};