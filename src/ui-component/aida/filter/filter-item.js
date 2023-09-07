import { useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useFilterContext } from 'contexts/filter';
import { toSimpleDateString } from 'helpers';
import { TypographyWithPopover } from 'ui-component/aida/base';

export const FilterItem = ({
  value,
  onEdit,
  onDelete,
  isFirst,
  wrapperSx = {}
}) => {
  const { type, operator, value: filterValue, connector } = value;
  const { values, getFieldValues, operatorsWithoutValue, operatorsWithArrayValue } = useFilterContext();

  useEffect(() => {
    if (type && !values[type.field] && type.op_type === 'term_filter_op') {
      getFieldValues(type.field);
    }
  }, [type, getFieldValues, values]);

  let content = '';
  if (type === null) {
    content = 'new filter';
  } else {
    let itemValue = '';
    // if type and operator don't exist
    const opType = type ? type.op_type : value.op_type;
    const caption = type ? type.caption : value.caption;
    const op = operator ?? value.op;

    if (opType === 'date_filter_op') itemValue = toSimpleDateString(new Date(filterValue));
    else if (operatorsWithArrayValue.includes(op)) {
      itemValue = `[${(filterValue ?? []).map(item => item.caption ?? item).join(',')}]`;
    } else if (typeof filterValue === 'string') itemValue = filterValue;
    else itemValue = filterValue?.caption ?? '';

    content = (
      operatorsWithoutValue.includes(op) ?
        `${caption} ${op}` :
        `${caption} ${op} ${itemValue}`
    );
  }

  if (!isFirst && connector) {
    content = `${connector.value ?? connector} ${content}`;
  }

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      mx: 1, my: 1, px: 1, borderRadius: 1,
      border: theme => `1px solid ${theme.palette.primary.main}`,
      bgcolor: theme => theme.palette.primary.light
    }}>
      <TypographyWithPopover
        noWrap
        popWidth={400}
        sx={{ width: '100%', fontSize: '0.75rem' }}
        wrapperSx={{ py: 0, display: 'inline-block', maxWidth: 'calc(100% - 112px)', ...wrapperSx }}
      >
        {content}
      </TypographyWithPopover>
      {onEdit && onDelete && (
        <Box>
          <IconButton variant='text' onClick={onEdit}>
            <EditIcon stroke={1.5} size='1rem' />
          </IconButton>
          <IconButton variant='text' onClick={onDelete}>
            <CloseIcon stroke={1.5} size='1rem' />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}
