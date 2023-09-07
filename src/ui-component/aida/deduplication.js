import { FormControl, Option } from 'ui-component/aida/base';

const options = [
  { name: 'Global Deduplication', value: 'global' },
  { name: 'Custodian Deduplication', value: 'custodian' },
  { name: 'No Deduplication', value: 'none' }
];
export const DeduplicationOption = ({ value, onChange }) => (
  <Option
    sx={{ width: '100%' }}
    {...{
      options, value, onChange
    }}
  />
);
export const Deduplication = ({ value, onChange }) => (
  <FormControl
    sx={{ border: 'none', py: 1 }}
    label='Deduplication'
    element={(
      <Option
        sx={{ my: 1, width: '100%' }}
        {...{
          options, value, onChange
        }}
      />
    )}
  />
)
