import { FormControlLabel, Checkbox } from '@mui/material';

export const FacetCheckedBucket = ({ bucket, onChange = (f) => f }) => {
  return (
    <FormControlLabel
      key={bucket.name}
      sx={{
        mb: 0.5,
        display: 'flex',
        alignItems: 'start',
        '& .MuiCheckbox-root': {
          pt: 0
        }
      }}
      control={<Checkbox checked={bucket?.selected} disabled={bucket.count <= 0} onChange={onChange} />}
      label={bucket.count > 0 ? `${bucket.caption} (${bucket.count})` : bucket.caption}
    />
  );
};
