import { useRef } from 'react';
import { Box, Link, SvgIcon, Typography, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useDropzone } from 'react-dropzone';

const DropZoneStyle = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'space-around',
  flexDirection: 'column',
  padding: theme.spacing(1),
  margin: `${theme.spacing(1)} 0`,
  borderRadius: 8,
  backgroundColor: theme.palette.grey['50'],
  border: `1px solid ${theme.palette.grey['300']}`,
  '&:hover': { opacity: 0.72 }
}));

export const DropZone = ({
  files,
  accept,
  multiple,
  onChangeFiles,
  onDeleteFile,
  allowFolder,
  fileType = 'zip',
  loading,
  simpleInstruction,
  fileTypeDescription
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onChangeFiles,
    multiple: true,
    accept
  });

  const inputFoldersRef = useRef(null);
  const inputFilesRef = useRef(null);
  const extraProps = { webkitdirectory: '', directory: '' };

  return (
    <DropZoneStyle
      {...getRootProps()}
      onClick={undefined}
      sx={{
        cursor: 'inherit',
        ...(isDragActive && { opacity: 0.72 })
      }}
    >
      {allowFolder && <input {...getInputProps()} {...extraProps} ref={inputFoldersRef} multiple={multiple} />}
      <input {...getInputProps()} ref={inputFilesRef} multiple={multiple} />
      {!simpleInstruction && (
        <>
          <SvgIcon sx={{ my: 2 }}>
            <CloudUploadOutlinedIcon />
          </SvgIcon>
          <Typography sx={{ my: 2 }}>
            Click to upload{multiple ? ' ' : ' a '}
            {allowFolder && (
              <>
                <Link href="#!" sx={{ textDecoration: 'none' }} onClick={() => inputFoldersRef.current.click()}>
                  folder{multiple ? 's' : ''}
                </Link>
                {multiple ? ' or ' : ' or a '}
              </>
            )}
            <Link href="#!" sx={{ textDecoration: 'none' }} onClick={() => inputFilesRef.current.click()}>
              {fileType} file{multiple ? 's' : ''}
            </Link>
            , or drag and drop
          </Typography>
        </>
      )}
      {simpleInstruction && (
        <>
          <SvgIcon sx={{ my: 2 }}>
            <ErrorOutlineOutlinedIcon />
          </SvgIcon>
          <Typography sx={{ my: 2 }}>
            <Link href="#!" sx={{ textDecoration: 'none' }} onClick={() => inputFilesRef.current.click()}>
              Click to upload
            </Link>
            , or drag and drop
          </Typography>
          {fileTypeDescription && <Typography sx={{ mt: -2, mb: 2 }}>{fileTypeDescription}</Typography>}
        </>
      )}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {loading && <CircularProgress size={20} />}
        {files.length > 0 &&
          files.map((item, idx) => (
            <Chip key={`${item.name}-${idx}`} label={item.name} onDelete={() => onDeleteFile(idx)} />
          ))}
      </Box>
    </DropZoneStyle>
  );
};
