import { forwardRef, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import useWebSocket from 'react-use-websocket';

import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { TOKEN_EXPIRED_MSG } from 'aida-constants';
import { WEBSOCKET_BASE_URL } from 'config';
import { getCurrentUserToken, getChatRoomDataIndex } from 'helpers/utils';
import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';
import { useDispatch, useSelector } from 'store';
import { activeItem, openDrawer } from 'store/slices/menu';
import {
  resetChatMessages,
  updateChatMessage,
  deleteChatMessage,
  getLastReadMessage,
  updateUnreadMessagesCount
} from 'store/slices/chat';

const NavChatsMenuItem = ({ item, level }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));
  const { refreshToken } = useAuth();
  const { projectId } = useParams();
  const userToken = getCurrentUserToken();
  const roomId = item.roomId;
  const dataIndex = getChatRoomDataIndex(projectId, roomId);
  const unreadMessagesData = useSelector((state) => state.chat.unreadMessagesData);
  const messageHistory = useSelector((state) => state.chat.data[dataIndex]?.messages ?? []);
  const lastReadData = useSelector((state) => state.chat.lastReadData);
  const hasUnreadMessages = Boolean(unreadMessagesData[dataIndex]);

  const { borderRadius } = useConfig();
  const dispatch = useDispatch();
  const { openItem } = useSelector((state) => state.menu);

  // Public API that will echo messages sent to it back to the client
  const socketUrl = `${WEBSOCKET_BASE_URL}/ws/cases/${projectId}/chat_rooms/${roomId}?token=${userToken}`;

  const { lastJsonMessage } = useWebSocket(
    socketUrl,
    {
      share: true,
      onError: (event) => console.log('Websocket error:', event),
      onMessage: (event) => {
        if (event.data === TOKEN_EXPIRED_MSG) {
          refreshToken();
        }
      },
      shouldReconnect: () => !!userToken,
      reconnectAttempts: 10,
      reconnectInterval: 3000
    },
    !process.env.REACT_APP_TESTING
  );

  const lastMessage = process.env.REACT_APP_TESTING ? null : lastJsonMessage;

  useEffect(() => {
    dispatch(getLastReadMessage({ projectId, roomId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (lastMessage !== null) {
      if (lastMessage.type === 'list' || lastMessage.type === 'refresh')
        dispatch(resetChatMessages({ roomId, projectId, data: lastMessage.data }));
      else if (lastMessage.type === 'update')
        dispatch(updateChatMessage({ roomId, projectId, data: lastMessage.data }));
      else if (lastMessage.type === 'delete')
        dispatch(deleteChatMessage({ roomId, projectId, data: lastMessage.data }));
    }
  }, [dispatch, lastMessage, projectId, roomId]);

  useEffect(() => {
    if (lastReadData[dataIndex]) {
      dispatch(updateUnreadMessagesCount({ roomId, projectId }));
    }
  }, [dispatch, lastReadData, messageHistory, projectId, roomId, dataIndex]);

  const Icon = item?.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={2} size="1.5rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: openItem.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height: openItem.findIndex((id) => id === item?.id) > -1 ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    dispatch(activeItem([id]));
    if (matchesSM) dispatch(openDrawer(false));
  };

  // active menu item on page load
  useEffect(() => {
    if (pathname === '' || pathname === '/') {
      dispatch(activeItem(['']));
      return;
    }
    const currentIndex = pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch(activeItem([item.id]));
    }
    // eslint-disable-next-line
  }, []);

  const selected = level === 1 && pathname.startsWith(item.url);

  const dotColorSx = {
    '& svg': {
      color: `${theme.palette.success.main} !important`
    },
    '& svg:hover': {
      color: `${theme.palette.success.dark} !important`
    }
  };

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${borderRadius}px`,
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`
      }}
      selected={selected}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36, ...dotColorSx }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={openItem?.findIndex((id) => id === item.id) > -1 || hasUnreadMessages ? 'h5' : 'body1'}
            color="inherit"
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavChatsMenuItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavChatsMenuItem;
