import { ChangeEvent, FC, useEffect, useState } from "react"
import { usePlayAudio } from "../hooks/use-play-audio"
import { useUserStylesContext } from "../hooks/use-user-styles-context";
import { hash } from "../utils/hash";
import { emojis } from "../utils/emojis";
import { useAudioSettingsContext } from "../hooks/use-audio-settings-context";
import { debounce } from 'lodash';

interface FileList {
  files: string[]
}

interface ExternalAudio {
  url: string;
  name: string;
}

export const ButtonList: FC = () => {
const [localFiles, setLocalFiles] = useState<string[]>([]);
const [refreshData, setRefreshData] = useState(false);
const { buttonGap } = useUserStylesContext();
const { removeSounds } = useAudioSettingsContext();
const [search, setSearch] = useState("");
const [externalAudio, setExternalAudio] = useState<ExternalAudio[]>([]);


  useEffect(() => {
    const getFiles = async (): Promise<void> => {
      const response = await fetch("http://localhost:3000/files");
      
      const data: FileList = await response.json();
      setLocalFiles(data.files);
    }

    getFiles();
  }, [refreshData])

  useEffect(() => {
    if(search === "") {
      setExternalAudio([]);
      return;
    }
    const getExternalSounds = async (): Promise<void> => {
      const response = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({search})
      })

      const data: ExternalAudio[] = await response.json();
      setExternalAudio(data);
    }
    getExternalSounds();
  }, [search])

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  }

  const debouncedHandleSearch = debounce(handleSearch, 500);

  const filteredSounds = localFiles.filter((sound) => sound.includes(search))

  return (
    <>
      <h1>Sounds</h1>
      <button onClick={() => {setRefreshData(!refreshData)}}>Refresh ↻</button>
      <button onClick={() => {removeSounds()}}>Stop all</button>
      <input className={"rounded-lg p-2 ml-1 max-w-[20rem]"} placeholder="Search..." autoComplete={"off"} onChange={debouncedHandleSearch}/>
      {search !== "" ? (
        <p>Found {filteredSounds.length} local result{filteredSounds.length !== 1 ? "s" : ""}.</p>
      ) : null}
      <div className="pt-2 flex flex-wrap"
      style={{
        gap: `${buttonGap}rem`
      }}>
        {filteredSounds.map((file) => <Sound key={file} name={file} url={`/sounds/${file}`} />)}
      </div>
     <br />
      {search !== "" ? (
        <p>Found {externalAudio.length} online result{externalAudio.length !== 1 ? "s" : ""}.</p>
      ) : null}
      <div className="pt-2 flex flex-wrap"
      style={{
        gap: `${buttonGap}rem`
      }}>
        {externalAudio.map((file) => <ExternalSound key={file.name} name={file.name} url={file.url} />)}
      </div>
    </>
  )
}

const colours = [
  "#F87171",
  "#F7B05B",
  "#F7934C",
  "#CC5803",
  "#763602",
  "#058C42",
  "#628395",
  "#A03E99",
  "#0B6E4F",
  "#FFBF00",
  "#9BC1BC",
  "#902923",
  "#49BEAA",
  "#99B2DD",
  "#9E0059",
];


const Sound: FC<{url: string; name: string}> = ({url, name}) => {
  const { previewAndBroadcastSound } = usePlayAudio();
  const handleClick = () => previewAndBroadcastSound(url);
  const { buttonSize, showEmojis, showNames } = useUserStylesContext();
  const emoji = emojis[hash(name) % emojis.length]

  return (
    <div className={"block group opacity-90 hover:-translate-y-1 hover:opacity-100 transition-all"}
    style={{
      width: `${buttonSize}rem`,
      height: `${buttonSize}rem`,
    }}>
    <button
    className={"w-full h-full break-words"}
    style={{
      backgroundColor: colours[hash(name) % colours.length],
    }}
    key={name+url}
    onClick={handleClick}
    >
    {showEmojis ? <div className={`text-3xl ${showNames ? "" : "group-hover:hidden"}`}>{emoji}<br /></div> : null}
    <p className={`${showNames ? "block" : "hidden"} group-hover:block`}>{name.replace(/\.[^/.]+$/, "")}</p>
    </button>
    </div>
  )
}

const ExternalSound: FC<{url: string, name: string}> = ({url, name}) => {
  const { previewAndBroadcastSound } = usePlayAudio();
  const handleClick = () => previewAndBroadcastSound(url);
  const { buttonSize, showEmojis, showNames } = useUserStylesContext();
  const emoji = emojis[hash(name) % emojis.length]

  return (
    <div className={"block group opacity-90 hover:-translate-y-1 hover:opacity-100 transition-all"}
    style={{
      width: `${buttonSize}rem`,
      height: `${buttonSize}rem`,
    }}>
    <button
    className={"w-full h-full break-words"}
    style={{
      backgroundColor: colours[hash(name) % colours.length],
    }}
    key={name+url}
    onClick={handleClick}
    >
    {showEmojis ? <div className={`text-3xl ${showNames ? "" : "group-hover:hidden"}`}>{emoji}<br /></div> : null}
    <p className={`${showNames ? "block" : "hidden"} group-hover:block`}>{name.replace(/\.[^/.]+$/, "")}</p>
    </button>
    </div>
  )
}

