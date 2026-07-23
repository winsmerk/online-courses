"use client";

import {
  Gauge,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function LessonVideoPlayer({ src }: { src: string }) {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  }

  function changePlaybackRate(nextRate: number) {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  }

  function changeVolume(nextVolume: number) {
    const video = videoRef.current;
    if (!video) return;
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  function seekTo(nextTime: number) {
    const video = videoRef.current;
    if (!video) return;
    const safeTime = Math.min(Math.max(nextTime, 0), duration || nextTime);
    video.currentTime = safeTime;
    setCurrentTime(safeTime);
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (playerRef.current?.requestFullscreen) {
      await playerRef.current.requestFullscreen();
      return;
    }

    const video = videoRef.current as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    };
    video?.webkitEnterFullscreen?.();
  }

  return (
    <div className="lesson-video-player" ref={playerRef}>
      <div className="video-frame">
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="metadata"
          onLoadedMetadata={(event) => {
            const nextDuration = event.currentTarget.duration;
            setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
          }}
          onDurationChange={(event) => {
            const nextDuration = event.currentTarget.duration;
            setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
          }}
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onRateChange={(event) =>
            setPlaybackRate(event.currentTarget.playbackRate)
          }
          onVolumeChange={(event) => {
            setVolume(event.currentTarget.volume);
            setIsMuted(event.currentTarget.muted);
          }}
        />
      </div>
      <div className="video-progress-row">
        <time dateTime={`PT${Math.floor(currentTime)}S`}>
          {formatTime(currentTime)}
        </time>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seekTo(Number(event.target.value))}
          aria-label={t("视频进度")}
          aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
          disabled={!duration}
        />
        <time dateTime={`PT${Math.floor(duration)}S`}>
          {formatTime(duration)}
        </time>
      </div>
      <div className="video-toolbar" aria-label={t("视频播放控制")}>
        <div className="video-toolbar-group">
          <button
            className="video-control-button"
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? t("暂停") : t("播放")}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} />}
            <span>{isPlaying ? t("暂停") : t("播放")}</span>
          </button>
          <div className="volume-control">
            <button
              className="video-icon-button"
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? t("取消静音") : t("静音")}
              title={isMuted ? t("取消静音") : t("静音")}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              aria-label={t("音量")}
            />
          </div>
        </div>
        <div className="video-toolbar-group">
          <label className="playback-rate-control">
            <Gauge size={17} aria-hidden="true" />
            <span>{t("播放速度")}</span>
            <select
              value={playbackRate}
              onChange={(event) =>
                changePlaybackRate(Number(event.target.value))
              }
              aria-label={t("播放速度")}
            >
              {PLAYBACK_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}×
                </option>
              ))}
            </select>
          </label>
          <button
            className="video-icon-button"
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t("退出全屏") : t("进入全屏")}
            title={isFullscreen ? t("退出全屏") : t("进入全屏")}
          >
            {isFullscreen ? (
              <Minimize2 size={18} />
            ) : (
              <Maximize2 size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
