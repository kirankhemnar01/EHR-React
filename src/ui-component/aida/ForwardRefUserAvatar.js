import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MuiAvatar from '@mui/material/Avatar';

const ForwardRefUserAvatar = forwardRef(({ user, size, sx, ...others }, ref) => {
    const theme = useTheme();
    let sizeSX = {};
    switch (size) {
        case 'badge':
            sizeSX = {
                width: theme.spacing(3.5),
                height: theme.spacing(3.5)
            };
            break;
        case 'xs':
            sizeSX = {
                width: theme.spacing(4.25),
                height: theme.spacing(4.25)
            };
            break;
        case 'sm':
            sizeSX = {
                width: theme.spacing(5),
                height: theme.spacing(5)
            };
            break;
        case 'lg':
            sizeSX = {
                width: theme.spacing(9),
                height: theme.spacing(9)
            };
            break;
        case 'xl':
            sizeSX = {
                width: theme.spacing(10.25),
                height: theme.spacing(10.25)
            };
            break;
        case 'md':
            sizeSX = {
                width: theme.spacing(7.5),
                height: theme.spacing(7.5)
            };
            break;
        default:
            sizeSX = {};
    }

    return (
        <MuiAvatar
            ref={ref}
            alt={user?.name}
            title={user?.name}
            sx={{ cursor: 'pointer', color: '#ffffff', bgcolor: user?.color, ...sizeSX, ...sx }}
            {...others}
        >
            {user?.initials}
        </MuiAvatar>
    );
});

export default ForwardRefUserAvatar;
