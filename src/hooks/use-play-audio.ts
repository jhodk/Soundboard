import { useAudioSettingsContext } from "./use-audio-settings-context";
import { v4 as uuidv4 } from 'uuid';

interface UsePlayAudio {
  previewAndBroadcastSound: (url: string) => Promise<void>;
  previewSound: (url: string) => Promise<void>;
}

export type PlaybackType = "preview" | "broadcast";

export const usePlayAudio = (): UsePlayAudio => {
  const {previewDeviceId, broadcastDeviceId, previewVolume, broadcastVolume, addSound, removeSound, playbackDelay} = useAudioSettingsContext();
  const playSound = async (url: string, playbackType: PlaybackType): Promise<void> => {
    const audio: ExtendedAudioElement = new Audio(url);
    audio.setSinkId(playbackType === "preview" ? previewDeviceId : broadcastDeviceId);
    audio.volume = (playbackType === "preview" ? previewVolume : broadcastVolume)/100;
    const audioId = uuidv4();
    addSound(audio, playbackType, audioId);
    audio.onended = () => {
      removeSound(audioId);
    }
    setTimeout(() => audio.play(), playbackDelay * 100)
  }

  const previewSound = async (url: string): Promise<void> => {
    await playSound(url, "preview");
  }

  const broadcastSound = async (url: string): Promise<void> => {
    await playSound(url, "broadcast");
  }

  const previewAndBroadcastSound = async (url: string): Promise<void> => {
    await previewSound(url);
    if(previewDeviceId !== broadcastDeviceId) {
      await broadcastSound(url);
    }
  }

  return {
    previewAndBroadcastSound,
    previewSound,
  }
}