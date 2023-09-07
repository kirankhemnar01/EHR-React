import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Autocomplete, TextField } from '@mui/material';

// project imports
import { useReviewers } from 'service/reviewers';
import { CustomPopper } from 'ui-component/aida/custom';

export const MultipleReviewersAutocomplete = ({ name, value, onChange, onOpen, label = 'Reviewers' }) => {
  const { projectId } = useParams();
  const { data } = useReviewers(projectId, '');

  const reviewers = data?.results;
  const [reviewerOptions, setReviewerOptions] = useState([]);
  useEffect(() => {
    if (reviewers) setReviewerOptions(Object.values(reviewers));
  }, [reviewers]);

  return (
    <Autocomplete
      fullWidth
      multiple
      name={name}
      options={reviewerOptions}
      getOptionLabel={(option) => option.name || option.user_id}
      isOptionEqualToValue={(option, value) => option.user_id === value?.user_id}
      value={value}
      onChange={(e, value) => onChange(e, value)}
      onOpen={onOpen}
      renderInput={(params) => <TextField {...params} label={label} />}
      PopperComponent={CustomPopper}
    />
  );
};
