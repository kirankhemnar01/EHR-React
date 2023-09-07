import { CardHeader, Box, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TypographyWithPopover, FlatCard } from 'ui-component/aida/base';
import { ItemState } from 'ui-component/aida/item-state';
import { IconLock } from '@tabler/icons';

export const ItemCard = ({
  data, onMenu, onView, idField, children, titleCaptialize = true, titleWidth = 160, isPrivate, sx = {}
}) => {

 const { name, [idField]: id, job, doc} = data;
 const state = job?.status ?? 'complete';


  const handleOnView = () =>{
    if(doc) onView(id,doc)
    else onView(id)
  }
  
  return (
    <FlatCard
      raised
      sx={{ cursor: 'pointer', ...sx }}
      onClick={handleOnView}
    >
      <CardHeader
        title={(
          <TypographyWithPopover
            variant='h3'
            noWrap
            wrapperSx={{ py: 0 }}
            sx={{
              color: theme => theme.palette.grey['900'],
              textTransform: titleCaptialize ? 'capitalize' : 'none',
              width: titleWidth,
              maxWidth: '100%'
            }}
          >
            {name}
          </TypographyWithPopover>
        )}
        action={(
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ItemState state={state} />
            {isPrivate && (<IconLock size={16} />)}
            <IconButton aria-label="settings" onClick={e => onMenu(e, id)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        )}
        sx={{
          pb: 0,
          px: 3,
          justifyContent: 'space-between',
          '& .MuiCardHeader-content': { maxWidth: state === 'complete' || !state ? 'calc(100% - 40px)' : 'calc(100% - 120px)' } }}
      />
      {children}
    </FlatCard>
  )
}