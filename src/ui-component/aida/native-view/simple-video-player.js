import { useRef } from 'react';
import { BACKEND_PROXY_URL } from 'config';
import httpClient from 'service/base';
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';
import { Box } from '@mui/material';
import { VideoPlayer } from './base-video-player';

export const VideoView = ({ url }) => {
  const proxyUrl = `${BACKEND_PROXY_URL}/video_stream.mp4?token=${httpClient.accessToken}&url=${url}`;
  const playerRef = useRef(null);

  const onTimeUpdate = e => {
    // TODO remove once video-player is completed
    console.log(e.target.currentTime);
  };

  const onLoadedMetadata = () => {
    // TODO remove once video-player is completed
    console.log(playerRef.current.getDuration());
  };

  return (
    <Box>
      <VideoPlayer url={proxyUrl} ref={playerRef} controls autoPlay {...{ onTimeUpdate, onLoadedMetadata }} />
    </Box>
  );
};
