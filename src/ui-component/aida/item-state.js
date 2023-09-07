import { Chip } from "@mui/material"

export const ItemState = ({ state, sx = {} }) => {
  if (state === 'complete' || !state) return null;

  return (
    <Chip
      size='small'
      label={state}
      sx = {{
        color: state === 'in_progress' ? '#344054' : '#B42318',
        bgcolor: state === 'in_progress' ? '#F2F4F7' : '#FEF3F2',
        ...sx
      }}
    />
  )
}