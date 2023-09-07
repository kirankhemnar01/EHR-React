import { Grid, Autocomplete, TextField, IconButton, Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useFilterContext, connectorOptions } from 'contexts/filter';
import { FilterValue } from './filter-value';
import { CustomPopper } from '../custom';
import { toDateString } from 'helpers';

export const FilterItemEdit = ({ value, onChange, onCancel, checkbox, connector }) => {
  const { filterTypes, getFieldValues, values, operatorsWithArrayValue, operatorsWithoutValue } = useFilterContext();

  const handleTypeChange = async (_, type) => {
    if (!type) return;

    let valueOptions = values[type.field];
    const isOption = type.op_type === 'term_filter_op';
    if (!valueOptions && isOption) {
      valueOptions = await getFieldValues(type.field);
    }

    let newValue = '';
    if (type.op_type === 'date_filter_op') {
      newValue = toDateString(new Date());
    } else if (isOption) {
      newValue = null;
    }

    onChange({ ...value, type, operator: type.op_options[0], value: newValue });
  };

  const handleConnectorChange = (_, connector) => {
    onChange({ ...value, connector });
  };

  const handleOperatorChange = (_, operator) => {
    const itemValue = value.value;
    if (operatorsWithArrayValue.includes(operator)) {
      if (!Array.isArray(itemValue)) {
        value.value = itemValue ? [itemValue] : [];
      }
    } else if (Array.isArray(itemValue)) {
      value.value = itemValue[0];
    }

    onChange({ ...value, operator });
  };

  const handleValueChange = (newValue) => {
    onChange({
      ...value,
      value: value.type?.op_type === 'date_filter_op' ? toDateString(newValue) : newValue
    });
  };

  const handleCheckChange = (_, checked) => {
    onChange({ ...value, checked });
  };

  return (
    <Grid
      className="SearchFilterRow"
      container
      spacing={0.5}
      rowSpacing={2}
      alignItems="center"
      sx={{
        my: 0.5,
        '& .MuiIconButton-root': {
          visibility: 'hidden'
        },
        '&:hover .MuiIconButton-root': {
          visibility: 'visible'
        }
      }}
    >
      {checkbox && (
        <Grid item xs={2} sm={1} className="check-col">
          <Checkbox checked={value.checked} onChange={handleCheckChange} disabled={!value.type} />
        </Grid>
      )}
      <Grid item xs={2} sm={1.5} className="check-connector">
        {connector && (
          <Autocomplete
            disableClearable
            disablePortal
            options={connectorOptions}
            getOptionLabel={(option) => option.name || ''}
            onChange={handleConnectorChange}
            value={value.connector}
            PopperComponent={CustomPopper}
            renderInput={(params) => <TextField {...params} label="Connector" />}
          />
        )}
      </Grid>
      <Grid item xs={4} sm={3} className="type-col">
        <Autocomplete
          disableClearable
          disablePortal
          options={filterTypes}
          getOptionLabel={(option) => option.caption || ''}
          onChange={handleTypeChange}
          value={value.type}
          renderInput={(params) => <TextField {...params} label="Type" />}
          renderOption={(props, option) => (
            <Box component="li" sx={{ minWidth: '100%', width: 'fit-content' }} {...props}>
              {option.caption}
            </Box>
          )}
          PopperComponent={CustomPopper}
          slotProps={{
            paper: { sx: { overflowX: 'auto' } }
          }}
        />
      </Grid>
      <Grid item xs={4} sm={2.5} className="operator-col">
        <Autocomplete
          disableClearable
          disablePortal
          options={value.type?.op_options ?? []}
          value={value.operator}
          onChange={handleOperatorChange}
          renderInput={(params) => <TextField {...params} label="Operator" />}
          PopperComponent={CustomPopper}
        />
      </Grid>
      <Grid item xs={10} sm={3} className="value-col">
        {!operatorsWithoutValue.includes(value.operator) && (
          <FilterValue type={value.type} value={value.value} onChange={handleValueChange} />
        )}
      </Grid>
      <Grid
        item
        xs={2}
        sm={checkbox ? 1 : 2}
        sx={{ display: 'flex', justifyContent: 'space-around' }}
        className="action-col"
      >
        {!checkbox && (
          <IconButton sx={{ color: (theme) => theme.palette.success.main }} onClick={() => onChange(value, true)}>
            <CheckIcon stroke={1.5} size="1rem" />
          </IconButton>
        )}
        <IconButton onClick={onCancel}>
          <CloseIcon stroke={1.5} size="1rem" />
        </IconButton>
      </Grid>
    </Grid>
  );
};
