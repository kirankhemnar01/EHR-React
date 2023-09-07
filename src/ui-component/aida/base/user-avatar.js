import Avatar from 'ui-component/extended/Avatar';

export const UserAvatar = ({ user, sx, ...others }) => {
  return (
    <Avatar
      alt={user?.name}
      title={user?.name}
      sx={{ cursor: 'pointer', color: '#ffffff', bgcolor: user?.color, ...sx }}
      {...others}
    >
      {user?.initials}
    </Avatar>
  );
};
