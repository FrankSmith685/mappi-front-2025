/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMusic,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";

interface AudioPlayerProps {
  titulo: string;
  src: string;
  onEnded?: () => void;
  autoPlay?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  showNextPrev?: boolean;
}

export const AudioPlayerBar: React.FC<AudioPlayerProps> = ({
  titulo,
  src,
  onEnded,
  autoPlay,
  onNext,
  onPrev,
  showNextPrev = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleProgress = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    setCurrentTime(currentTime);
    setProgress((currentTime / duration) * 100 || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || duration === 0 || isNaN(duration)) return;
    const percent = parseFloat(e.target.value);
    const time = (percent / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(percent);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    const handleAutoPlay = async () => {
      if (autoPlay) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("Autoplay bloqueado por el navegador:", err);
        }
      }
    };

    audio.addEventListener("timeupdate", handleProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    handleAutoPlay();

    return () => {
      audio.removeEventListener("timeupdate", handleProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [src]);

  return (
    <div
      className="
        w-full flex flex-col md:flex-row items-center justify-between gap-3
        px-4 py-3 bg-gradient-to-r from-primary/80 via-primary to-primary/80
        text-white shadow-2xl backdrop-blur-lg border-t border-primary/40
      "
    >
      {/* 🎵 Icono + título */}
      <div className="flex items-center gap-3 w-full md:w-[35%] min-w-[150px] justify-center md:justify-start">
        <div className="bg-white/20 p-2 rounded-lg flex items-center justify-center">
          <FiMusic className="text-white text-lg md:text-xl" />
        </div>
        <div className="flex flex-col truncate text-center md:text-left">
          <h4 className="font-semibold text-sm md:text-base truncate max-w-[220px] md:max-w-[300px]">
            {titulo}
          </h4>
          <span className="text-[11px] md:text-xs text-white/70">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* ▶️ Controles + barra */}
      <div className="flex items-center gap-3 w-full md:w-[40%] justify-center flex-wrap md:flex-nowrap">
        {showNextPrev && (
          <button
            onClick={onPrev}
            className="w-9 h-9 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <FiSkipBack size={16} />
          </button>
        )}

        <button
          onClick={togglePlay}
          className="w-9 h-9 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition"
        >
          {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
        </button>

        {showNextPrev && (
          <button
            onClick={onNext}
            className="w-9 h-9 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <FiSkipForward size={16} />
          </button>
        )}

        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="flex-1 min-w-[120px] md:w-60 accent-white cursor-pointer"
        />
      </div>

      {/* 🔊 Volumen */}
      <div className="flex items-center gap-3 w-full md:w-[20%] justify-center md:justify-end">
        <button
          onClick={toggleMute}
          className="hover:scale-110 transition-transform"
        >
          {isMuted || volume === 0 ? (
            <FiVolumeX size={18} />
          ) : (
            <FiVolume2 size={18} />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 md:w-20 accent-white cursor-pointer"
        />
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />
    </div>
  );
};
