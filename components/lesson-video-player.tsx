"use client";

import { Gauge, Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function LessonVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const { t } = useLanguage();

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

  return (
    <div className="lesson-video-player">
      <div className="video-frame">
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onRateChange={(event) =>
            setPlaybackRate(event.currentTarget.playbackRate)
          }
        />
      </div>
      <div className="video-toolbar" aria-label={t("视频播放控制")}>
        <button
          className="video-control-button"
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? t("暂停") : t("播放")}
        >
          {isPlaying ? <Pause size={17} /> : <Play size={17} />}
          <span>{isPlaying ? t("暂停") : t("播放")}</span>
        </button>
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
      </div>
    </div>
  );
}
