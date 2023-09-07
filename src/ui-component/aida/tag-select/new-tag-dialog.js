import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  Grid,
  Typography,
  Checkbox,
  CircularProgress,
  createFilterOptions
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ColorPicker } from 'ui-component/aida/base';
import { useNotification } from 'hooks/use-notification';
import useAida from 'hooks/useAida';
import { findColor, getMuiColor } from 'helpers/mui-colors';
import { SingleOptionAutocomplete } from '../base';

const filter = createFilterOptions();
export const typeOptions = [
  { name: 'Binary', value: 'binary' },
  { name: 'Confidence', value: 'confidence' },
  { name: 'Text', value: 'text' },
];
const initialValues = {
  name: '',
  group: null,
  color: findColor(''),
  valueType: { name: 'Binary', value: 'binary' },
  visible: true
}

export const NewTagDialog = ({ open, onClose }) => {
  const [busy, setBusy] = useState(false);
  const { notifyError, notifySuccess } = useNotification();
  const { tagGroups: { data: tagGroups, createTag, createTagWithGroupName } } = useAida();

  const groupOptions = tagGroups?.map(item => ({
    name: item.name,
    value: item.tag_group_id
  })) ?? [];

  const formik = useFormik({
    initialValues,
    validationSchema: yup.object({
      name: yup.string().required('Name is required'),
      group: yup.object({ name: yup.string(), value: yup.string() }).nullable(),
      valueType: yup.object({ name: yup.string(), value: yup.string() }),
      visible: yup.boolean()
    }),
    onSubmit: async (values) => {
      const { name, color, group, valueType, visible } = values;
      try {
        setBusy(true);
        const { value } = getMuiColor(color);

        // typeof group === 'string': for new tag group
        if (typeof group === 'string') {
          await createTagWithGroupName(group, name, value, valueType.value, visible);
        } else {
          await createTag(group.value, name, '', value, valueType.value, visible);
        }

        notifySuccess('Tag created successfully');
        if (onClose) onClose();
      } catch (e) {
        notifyError(e.message ?? 'Unknown error');
      } finally {
        setBusy(false);
      }
    }
  });

  const changeColor = (color, index) => {
    formik.setFieldValue('color', { color, index });
  }

  useEffect(() => {
    if (!open) {
      formik.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          New Tag
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mb: 2 }}>
            <TextField
              label='Tag Name'
              variant='outlined'
              fullWidth
              id='name'
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mt: 1 }}
            />

            <SingleOptionAutocomplete
              width='100%'
              label='Tag Group'
              options={groupOptions}
              value={formik.values.group}
              onChange={value => formik.setFieldValue('group', value)}
              error={formik.touched.group && Boolean(formik.errors.group)}
              helperText={formik.touched.group && formik.errors.group}
              sx={{ width: '100%' }}
              freeSolo
              selectOnFocus
              clearOnBlur
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option.name);
                if (inputValue !== '' && !isExisting && !filtered.length) {
                  filtered.push({ name: `Add "${inputValue}"`, inputValue });
                }

                return filtered;
              }}
            />
          </Stack>

          <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={4}>
              <Typography sx={{ px: 1 }}>Color</Typography>
            </Grid>
            <Grid item xs={8}>
              <ColorPicker
                {...formik.values.color}
                onColor={changeColor}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={4}>
              <Typography sx={{ px: 1 }}>Value Type</Typography>
            </Grid>
            <Grid item xs={8}>
              <SingleOptionAutocomplete
                width='100%'
                options={typeOptions}
                value={formik.values.valueType}
                onChange={value => formik.setFieldValue('valueType', value)}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={4}>
              <Typography sx={{ px: 1 }}>Visible</Typography>
            </Grid>
            <Grid item xs={8}>
              <Checkbox
                checked={formik.values.visible ?? false}
                onChange={e => formik.setFieldValue('visible', e.target.checked)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button variant='outlined' onClick={onClose}>Cancel</Button>
          <Button variant='contained' type='submit' sx={{ width: 120 }}>
            Create
            {busy && <CircularProgress size={16} sx={{ marginLeft: 1 }} color='warning' />}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
