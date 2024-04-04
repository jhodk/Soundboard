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
      <input className={"rounded-lg p-2 ml-1 max-w-[20rem]"} type="search" placeholder="Search..." autoComplete={"off"} onChange={debouncedHandleSearch}/>
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
        <p>Found {externalAudio.length} online result{externalAudio.length !== 1 ? "s" : ""}. {externalAudio.length > 0 ? "Right click > Save link as... to download." : ""}</p>
      ) : null}
      <div className="pt-2 flex flex-wrap"
      style={{
        gap: `${buttonGap}rem`
      }}>
        {externalAudio.map((file) => <Sound key={file.name} name={file.name} url={file.url} />)}
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

const Sound: FC<{url: string, name: string, index: number}> = ({url, name, index}) => {
  const { previewAndBroadcastSound, previewSound } = usePlayAudio();
  const { buttonSize, showEmojis, showNames } = useUserStylesContext();
  const emoji = emojis[hash(name) % emojis.length]
  const colour = colours[hash(name) % colours.length];

  return (
    <a href={url} onClick={(event) => {event.preventDefault()}} className={"flex text-m relative items-center rounded-md group opacity-90 hover:opacity-100 transition-all"}
    style={{
      width: `${buttonSize*2}rem`,
      height: `${buttonSize}rem`,
      backgroundColor: colour
    }}>
    <button
      className={"m-0 w-full h-full break-words z-20 opacity-0 group-hover:opacity-100 transition-all bg-opacity-50 text-[2.5rem]/6 hover:text-[2.75rem]/6 text-slate-200 hover:text-slate-50"}
      style={{backgroundColor: colour+"AA"}}
      key={name+url+index}
      onClick={() => previewAndBroadcastSound(url)}
      >▶
    </button>
    <button
    className={`tooltip absolute break-words z-20 opacity-0 group-hover:opacity-100 transition-all text-[1.5rem]/8 hover:text-[1.6rem]/8`}
    style={{backgroundColor: "#FFFFFF00"}}
    key={name+url}
    onClick={() => previewSound(url)}
    data-tooltip={`Preview ${name}`}
    >🔉
    </button>
    <div className={"-mr-10 absolute inline-flex items-center top-[50%] left-[50%] text-center"}
    style={{
      transform: "translate(-50%, -50%)"
    }}>
      {showEmojis ? <span className={`text-3xl z-10`}>{emoji}</span> : null}
      <p className={`${showNames ? "inline" : "hidden"}`}>{name.replace(/\.[^/.]+$/, "")}</p>
    </div>
  </a>
  )
}

