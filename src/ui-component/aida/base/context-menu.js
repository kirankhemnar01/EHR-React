import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';


export const ContextMenuItem = ({ onClick, icon: Icon, text, small }) => {
  return (
    <MenuItem
      onClick={onClick}
      sx={{
        lineHeight: 1.2,
        fontSize: small ? 14 : 16,
        minWidth: 160,
        padding: small ? '12px !important' : '16px !important',
        margin: '0 !important'
      }}
    >
      <ListItemIcon>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText sx={{ color: '#19191D', lineHeight: 1 }}>
        {text}
      </ListItemText>
    </MenuItem>
  )
}

export const ContextMenu = ({ position, onClose, onMenu, items, anchorEl, horizontal = 'right' }) => {
  const anchorProps = anchorEl ? {
    open: !!anchorEl,
    anchorEl
  } : {
    open: !!position,
    anchorReference: 'anchorPosition',
    anchorPosition: position ? {
      top: position.mouseY, left: position.mouseX
    } : null
  }
  return (
    <Menu
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal }}
      transformOrigin={{ vertical: 'top', horizontal }}
      {...anchorProps}
      gap={3}
      sx={{ '& .MuiList-root > .MuiMenuItem-root': { margin: 2, p: '12px 24px !important' } }}
    >
      {items.map(item => (
        <ContextMenuItem
          key={item.key}
          onClick={() => onMenu(item.key, position?.id)}
          icon={item.icon}
          text={item.title}
        />
      ))}
    </Menu>
  )
}
