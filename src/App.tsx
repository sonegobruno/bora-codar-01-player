import './styles/global.css'
import './styles/app.css'

import { Play, FastForward, Rewind, Pause} from 'phosphor-react'
import * as Progress from '@radix-ui/react-progress';
import { useEffect, useState } from 'react';
import { SONGS } from './utils/songs';
import { Song } from './entities/song';

const MAX_PROGRESS = 300

function formatTime(currentTime: number) {
  const timeInSeconds = Math.round(currentTime)

  if(!Number.isNaN(timeInSeconds)) {
    const minutesAmount = Math.floor( timeInSeconds / 60)
    const secondsAmount = timeInSeconds % 60
  
    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')
  
    return minutes.padStart(2, '0') + ':' + seconds.padStart(2, '0')
  }

  return '00:00'
}

function App() {
  const [ currentSong, setCurrentSong ] = useState<Song>(SONGS[0])
  const [ songPlaying, setSongPlaying ] = useState<HTMLAudioElement>(new Audio(SONGS[0].music))

  const [ isPlaying, setIsPlaying ] = useState(false)

  const [ currentTime, setCurrentTime ] = useState("00:00")
  const [ durantionTime, setDurantionTime ] = useState("00:00")
  const [progress, setProgress] = useState(0);

  const [ musicInterval, setMusicInterval ] = useState<number | null>(null)

  const progressTransform = { transform: `translateX(-${100 - progress}%)` }
  const isFirstSong = SONGS[0].id === currentSong.id

  useEffect(() => {
    setSongPlaying(new Audio(currentSong.music))
  },[currentSong])

  function calculeSongProgress() {
    if(songPlaying.currentTime >= songPlaying.duration) {
      handleNextSong()
    }

    const calculateProgress = 100 * songPlaying.currentTime / songPlaying.duration

    setCurrentTime(formatTime(songPlaying.currentTime))
    setProgress(calculateProgress)
  }

  function handlePlaySong() {
    songPlaying.play();
    setDurantionTime(formatTime(songPlaying.duration))
    clearSongInterval();

    const interval = setInterval(() => {
      calculeSongProgress()
    }, 1000)

    setMusicInterval(interval)
    setIsPlaying(true)
  }

  function handleStopSong() {
    songPlaying.pause();
    clearSongInterval();
    setIsPlaying(false)
  }

  function handlePreviousSong() {
    handleStopSong()
    clearTime();

    const currentSongIndex = SONGS.findIndex(song => song.id === currentSong.id)
    setCurrentSong({
      ...SONGS[currentSongIndex - 1]
    })
  }


  function handleNextSong() {
    handleStopSong()
    clearTime();

    const lastSongIndex = SONGS.length - 1
    const lastSong = SONGS[lastSongIndex]

    const isLastSong = lastSong.id === currentSong.id

    if(isLastSong) {
      setCurrentSong({ ...SONGS[0] })
    } else {
      const currentSongIndex = SONGS.findIndex(song => song.id === currentSong.id)
      setCurrentSong({ ...SONGS[currentSongIndex + 1] })
    }
  }

  function clearSongInterval() {
    if(musicInterval) {
      clearInterval(musicInterval)
    }
  }

  function clearTime() {
    setCurrentTime('00:00')
    setDurantionTime('00:00')
    setProgress(0)
  }

  return (
    <main>
      <section>
          <div className="music__container">
            <img src={currentSong.cover} alt="" />
            <div className="music__info">
              <strong>{currentSong.title}</strong>
              <p>{currentSong.band}</p>
            </div>
          </div>

          <div className="controls">
            <button disabled={isFirstSong} onClick={handlePreviousSong}>
              <Rewind size={27}  weight="fill"/>
            </button>
            {isPlaying ? (
              <button onClick={handleStopSong}>
                <Pause size={27}  weight="fill"/>
              </button>
            ) : (
              <button onClick={handlePlaySong}>
                <Play size={27}  weight="fill"/>
              </button>
            )}

            <button onClick={handleNextSong}>
              <FastForward size={27}  weight="fill"/>
            </button>
          </div>

          <div className="progress-bar__container">
            <Progress.Root className="progress-bar__root" value={66}>
              <Progress.Indicator className="progress-bar__indicator" style={progressTransform} />
            </Progress.Root>
            <div className="progress-bar__footer">
              <span>{currentTime}</span>
              <span>{durantionTime}</span>
            </div>
          </div>
      </section>
    </main>
  )
}

export default App
