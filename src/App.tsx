import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { ButtonList } from './components/button-list'
import { useAudioSettingsContext } from './hooks/use-audio-settings-context';
import { useUserStylesContext } from './hooks/use-user-styles-context';
import { RangeSlider } from './components/range-slider';
import { Checkbox } from './components/checkbox';

function App() {
  const {updateBroadcastDevice, updatePreviewDevice, updateBroadcastVolume, updatePreviewVolume, updatePlaybackDelay, playbackDelay } = useAudioSettingsContext();
  const { updateButtonGap, updateButtonSize, updateShowEmojis, updateShowNames} = useUserStylesContext();

  return (
    <div className="p-5">
      <h1>Soundboard</h1>
      <label htmlFor="broadcast-volume">
        Broadcast Volume
        </label>
      <VolumeSlider label={"broadcast"} setVolume={updateBroadcastVolume}/>
      <AudioDeviceSelect label={"broadcast"} setId={updateBroadcastDevice} />
      <br />
      <label htmlFor="preview-volume">
        Preview Volume
        </label>
        <VolumeSlider label={"preview"} setVolume={updatePreviewVolume}/>
      <AudioDeviceSelect label={"preview"} setId={updatePreviewDevice} />
      <br />
      <RangeSlider id="button-size" label="Button Size" min={0} max={200} localStorageKey="button-size" updateFn={updateButtonSize} defaultValue={5} />
      <RangeSlider id="button-gap" label="Button Gap" min={0} max={50} localStorageKey="button-gap" updateFn={updateButtonGap} defaultValue={1} />
      <RangeSlider id="playback-delay" label={`Playback Delay (${playbackDelay / 10}s)`} min={0} max={50} localStorageKey="playback-delay" updateFn={updatePlaybackDelay} defaultValue={0} />
      
      <Checkbox id="show-emojis" label="Show Emojis" localStorageKey="show-emojis" updateFn={updateShowEmojis}/>
      <Checkbox id="show-names" label="Show Names" localStorageKey="show-names" updateFn={updateShowNames}/>
      <ButtonList />
    </div>
  )
}

interface AudioDeviceSelectProps {
  label: string;
  setId: (id: string) => void;
}
const AudioDeviceSelect: FC<AudioDeviceSelectProps> = ({label, setId}) => {
  const [audioDevices, setAudioDevices] = useState<{name: string; id: string}[]>([]);

  useEffect(() => {
    const fetchAudioDevices = async () => {   
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioOutputs = devices.filter((device) => device.kind === 'audiooutput' && device.deviceId !== 'default');

    setAudioDevices(audioOutputs.map((device) => ({name: device.label, id: device.deviceId})))
    };
    fetchAudioDevices();
  }, [])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setId(event.target.value)
  }

  return (
    <div className="inline mx-5">
    <select
    onChange={handleChange}
    className="max-w-[20rem]"
    value={localStorage.getItem(`${label}-device`) ?? ""}
    >
      <option key="default">--Select a {label} device--</option>
      {audioDevices.map((device) =>
      <option key={device.id} value={device.id}>{device.name}</option>
      )}
      </select>
    </div>
  )
}

interface VolumeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  setVolume: (volume: number) => void;
}

const VolumeSlider: FC<VolumeSliderProps> = ({label, setVolume}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setVolume(parseInt(event.target.value, 10));
  }

  return (
    <input
      id={`${label}-volume`}
      type="range"
      className="inline w-[20rem] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      onChange={handleChange}
      value={localStorage.getItem(`${label}-volume`) ?? "50"}
      />
  );
}

export default App
