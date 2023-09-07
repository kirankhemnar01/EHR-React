import { useState, useEffect } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { BACKEND_BASE_URL } from 'config';
import { AudioPlayer } from 'ui-component/aida/file-players';
import httpClient from 'service/base';
import { VideoPlayer } from './base-video-player';

export const MediaNativeView = ({ doc, playerRef, onTimeUpdate, videoURL }) => {
  const { media_path: mediaPath, file_type: type } = doc;
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let url = '';
    async function fetchUrl() {
      if (!mediaPath || type === 'video') return;

      setUrl('');
      setError('');
      setBusy(true);
      try {
        url = await httpClient.getObjectURL(`${BACKEND_BASE_URL}/static${mediaPath}`);
        setUrl(url);
      } catch (e) {
        console.error(e);
        setError(`Failed to get ${BACKEND_BASE_URL}/static${mediaPath}`);
      } finally {
        setBusy(false);
      }
    }

    fetchUrl();
    return () => {
      if (url) {
        window.URL.revokeObjectURL(url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaPath, type]);

  if (!mediaPath) setError('Media preview is not available.');

  if (mediaPath) {
    if (type === 'audio') {
      return !url ? <CircularProgress color="warning" size={32} m={1} /> : <AudioPlayer url={url} />;
    }

    return <VideoPlayer url={videoURL} ref={playerRef} {...{ onTimeUpdate }} />;
  }

  if (error) {
    return (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-wrap',
          color: 'error.main',
          p: 1
        }}
      >
        {error}
      </Typography>
    );
  }

  return busy ? <CircularProgress color="warning" size={32} m={1} /> : null;
};
