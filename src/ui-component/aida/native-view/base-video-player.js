/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { MediaPlayer, MediaOutlet } from '@vidstack/react';
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';
import { BACKEND_PROXY_URL } from 'config';
import httpClient from '../../../service/base';

export const VideoPlayer = forwardRef(({ url, ...others }, ref) => {
  const videoRef = useRef(null);
  const proxyUrl = `${BACKEND_PROXY_URL}/video_stream.mp4?token=${httpClient.accessToken}&url=${url}`;

  useImperativeHandle(ref, () => {
    return {
      playVideo() {
        if (!videoRef.current || !videoRef.current.paused) return;
        videoRef.current.play();
      },

      pauseVideo() {
        if (!videoRef.current || videoRef.current.paused) return;
        videoRef.current.pause();
      },

      forward() {
        if (!videoRef.current) return;
        videoRef.current.currentTime += 10;
      },

      backward() {
        if (!videoRef.current) return;
        videoRef.current.currentTime -= 10;
      },

      setCurrentTime(percent) {
        if (!videoRef.current) return;

        const time = videoRef.current.duration * (percent / 100);
        if (time) videoRef.current.currentTime = time;
      },

      getDuration() {
        if (!videoRef.current) return -1;
        return videoRef.current.duration;
      }
    };
  });

  useEffect(() => {
    videoRef.current.muted = false;
  }, []);

  return (
    <MediaPlayer title="Sprite Fight" aspect-ratio="3/2" load="idle" marginTop="1px" >
      <MediaOutlet>
        <video ref={videoRef} width="100%" muted="true" {...others}>
          <source src={proxyUrl} type="video/mp4" />
        </video>
      </MediaOutlet>
    </MediaPlayer>
  );
});
