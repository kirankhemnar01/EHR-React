import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, FormControl, Button, FormHelperText, TextField, Typography, useTheme } from '@mui/material';
import { useProjectUpload } from 'hooks/use-upload';
import { uploadDataFile } from 'service/deposition/depositions';
import { DropZone } from './dropzone';
import { UploadProgress } from 'ui-component/aida';

function DepositionSelect({
  options,
  value,
  onChange,
  helperText,
  error = false,
  createOption,
  loading = false,
  fileType,
  acceptType
}) {
  const theme = useTheme();
  const [isDropVisible, setDropVisible] = useState(false);
  const [files, setFiles] = useState(new DataTransfer().files);
  const { projectId } = useParams();

  const { result, status, progress } = useProjectUpload(uploadDataFile, `${projectId}_deposition`, files);

  const realOptions = useMemo(() => {
    if (createOption) return [...options, createOption];
    return [...options];
  }, [options, createOption]);

  const handleChange = (_, newValue) => {
    if (createOption && newValue.value === createOption.value) {
      setDropVisible(!isDropVisible);
    }
    if (isDropVisible) setDropVisible(false);
    onChange(newValue);
  };

  const onUploadFileChange = async (files) => {
    if (files.length) {
      setFiles(files);
    }
  };

  useEffect(() => {
    if (result?.file_path && status === 'complete') {
      setDropVisible(false);
      handleChange('', {
        name: 'Uploaded new file',
        value: result?.doc_id
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const onDeleteFile = (idx) => {
    const data = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      if (i !== idx) {
        data.items.add(files[i]);
      }
    }
    setFiles(data.files);
  };

  const getRenderOption = (props, option) => {
    let ele;
    if (option.value === createOption?.value) {
      ele = (
        <li {...props} style={{ borderTop: '1px solid #d9d9d9' }}>
          <Button variant="text">{option.name}</Button>
        </li>
      );
    } else
      ele = (
        <li {...props} key={option.value}>
          <Typography sx={{ color: theme.palette.grey['900'] }}>{option.name}</Typography>
        </li>
      );
    return ele;
  };
  const helperSx = error ? { color: (theme) => theme.palette.error.main } : {};
  return (
    <FormControl variant="standard" fullWidth>
      <Autocomplete
        fullWidth
        disableClearable
        value={value}
        loading={loading}
        onChange={handleChange}
        getOptionLabel={(option) => option?.name}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        options={realOptions}
        renderOption={getRenderOption}
        renderInput={(params) => <TextField {...params} />}
        filterOptions={(options, state) => {
          if (state.inputValue) {
            const v = state.inputValue.toLowerCase();
            return options.filter((opt) => opt.name.toLowerCase().includes(v) || opt.value === createOption?.value);
          }
          return options;
        }}
      />
      {helperText && (
        <FormHelperText size="small" sx={{ mx: '14px', ...helperSx }}>
          {helperText}
        </FormHelperText>
      )}
      {isDropVisible && (
        <>
          <DropZone
            files={files}
            accept={acceptType}
            multiple={false}
            onChangeFiles={onUploadFileChange}
            onDeleteFile={onDeleteFile}
            allowFolder={false}
            fileType={fileType}
            loading={loading}
          />
          {createOption && progress.size > 0 && <UploadProgress {...progress} />}
        </>
      )}
    </FormControl>
  );
}

export default DepositionSelect;
