import { PlayedAudio } from "../context/audio-settings-context";
import { PlaybackType } from "../hooks/use-play-audio";

const sounds: PlayedAudio[] = [];

export const AudioManager = {
  addSound: (sound: PlayedAudio) => {
    sounds.push(sound)
  },
  updateVolumes: (type: PlaybackType, volume: number) => {
    sounds.forEach((sound) => {
      if(sound.type === type) {
        sound.audio.volume = volume/100;
      }
    });
  },
  removeSound: (id: string) => {
    const index = sounds.findIndex((s) => s.id === id);
    if(index !== -1) {
      sounds[index].audio.pause();
      sounds[index].audio.src = '';
      sounds.splice(index, 1);
    }
  },
  removeSounds: () => {
    sounds.forEach((sound) => {
      sound.audio.pause();
      sound.audio.src = '';
    })
    sounds.length = 0;
  }
};