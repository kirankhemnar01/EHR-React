import { useState, useRef, useEffect } from 'react';
import { Box, Slider, Stack, Typography, LinearProgress, IconButton, SvgIcon } from '@mui/material';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import WaveSurfer from "wavesurfer.js";
import { formatTimestamp } from 'helpers/datetime';


const formWaveSurferOptions = ref => ({
  container: ref,
  waveColor: "#eee",
  progressColor: "OrangeRed",
  cursorColor: "OrangeRed",
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 150,
  normalize: true,
  partialRender: true
});

export const AudioPlayer = ({ url }) => {

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [play, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loading, setLoading] = useState(0);
  const [error, setError] = useState('');

  const [duration, setDuration] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setPlay(false);
    setError('');
    setLoading(0);
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.on("ready", () => {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
        setLoading(100);
        setDuration(wavesurfer.current.getDuration());
        setCurrent(0);
      }
    });

    wavesurfer.current.on('loading', (loading) => {
      setLoading(loading);
    });

    wavesurfer.current.on('error', (error) => {
      setError(typeof error === 'string' ? error : 'Unknown error');
    });

    wavesurfer.current.on('finish', () => {
      setPlay(false);
    });

    wavesurfer.current.on('audioprocess', (value) => {
      setCurrent(value);
    });

    wavesurfer.current.on('seek', (value) => {
      setCurrent(wavesurfer.current.getDuration() * value);
    });

    wavesurfer.current.load(url);

    return () => wavesurfer.current.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!play);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = (_, value) => {
    setVolume(value);
    wavesurfer.current.setVolume(value || 1);
  };

  const onVolumeIncrease = (value) => {
    let newVol = volume + value;
    if (newVol < 0) newVol = 0;
    if (newVol > 1) newVol = 1;
    setVolume(newVol);
    wavesurfer.current.setVolume(newVol || 1);
  }

  const onSeek = (_, value) => {
    setCurrent(value);
    wavesurfer.current.setCurrentTime(value);
  }

  if (error) {
    return (
      <Typography sx={{ color: theme => theme.palette.error.main, my: 1 }}>
        {JSON.stringify(error)}
      </Typography>
    )
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ px: 2 }}>
        <Box id='waveform' ref={waveformRef} sx={{ display: loading < 100 ? 'none' : 'block' }} />
      </Box>
      {loading < 100 && !error && (
        <Box>
          <Typography sx={{ mt: 1, mb: 0 }}>
            Loading media ... {loading} %
          </Typography>
          <LinearProgress
            variant='determinate'
            value={loading}
            sx={{ mx: 'auto', my: 2, display: 'block' }}
          />
        </Box>
      )}
      {loading >= 100 && (
        <Box sx={{ my: 2 }}>
          <Box sx={{ pl: 2, pr: 2 }}>
            <Slider
              value={current}
              onChange={onSeek}
              min={0}
              max={duration}
              step={0.01}
              sx={(theme) => ({
                height: 6,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  transition: 'none',
                  '&:before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                      ? 'rgb(255 255 255 / 16%)'
                      : 'rgb(0 0 0 / 16%)'
                      }`,
                  },
                  '&.Mui-active': {
                    width: 12,
                    height: 12,
                  },
                },
                '& .MuiSlider-rail': {
                  opacity: 0.28,
                },
                '& .MuiSlider-track': {
                  transition: 'none'
                }
              })}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pr: 0.5 }}>
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2, md: 3 }, alignItems: 'center' }}>
              <IconButton onClick={handlePlayPause}>
                <SvgIcon fontSize='large' color='primary'>
                  {play ? <PauseCircleIcon /> : <PlayCircleIcon />}
                </SvgIcon>
              </IconButton>
              <Typography sx={{ lineHeight: 1.4 }}>
                {`${formatTimestamp(current)} / ${formatTimestamp(duration)}`}
              </Typography>
            </Box>
            <Stack spacing={{ xs: 0, sm: 1, md: 2 }} direction="row" sx={{ minWidth: { xs: 192, sm: 240 } }} alignItems="center">
              <IconButton onClick={() => onVolumeIncrease(-0.1)}>
                <SvgIcon color='primary'>
                  <VolumeDown />
                </SvgIcon>
              </IconButton>
              <Slider value={volume} onChange={onVolumeChange} min={0} max={1} step={0.05} />
              <IconButton onClick={() => onVolumeIncrease(0.1)}>
                <SvgIcon color='primary'>
                  <VolumeUp />
                </SvgIcon>
              </IconButton>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
