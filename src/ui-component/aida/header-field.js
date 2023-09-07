import React from 'react';
import {
  SvgIcon,
  Checkbox,
  TableCell,
  TableRow
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { Option, TypographyWithPopover } from 'ui-component/aida/base';

export const HeaderField = React.memo(({ data, idx, options, selected, onSelect, onChangeField }) => (
  <TableRow onClick={() => onSelect(idx)}>
    <TableCell sx={{ pl: 1 }} padding='checkbox'>
      <Checkbox color='primary' checked={selected} />
    </TableCell>
    <TableCell>
      <TypographyWithPopover copy noWrap sx={{ width: 160 }} popWidth={400}>
        {data.column}
      </TypographyWithPopover>
    </TableCell>
    <TableCell>
      {data.previews.map((item, idx) => (
        <TypographyWithPopover copy noWrap key={idx} sx={{ width: 200 }} popWidth={400}>
          {item}
        </TypographyWithPopover>
      ))}
    </TableCell>
    <TableCell>
      {!!data.field && (
        <SvgIcon
          color='success'
          sx={{
            borderRadius: '50%',
            bgcolor: theme => theme.palette.success.light,
            margin: 'auto',
            display: 'block'
          }}
        >
          <DoneIcon />
        </SvgIcon>
      )}
    </TableCell>
    <TableCell>
      <Option
        sx={{ width: 160 }}
        options={options}
        value={data.field?.field_id ?? ''}
        onChange={(value) => onChangeField(idx, value)}
        empty
      />
    </TableCell>
  </TableRow>
));
