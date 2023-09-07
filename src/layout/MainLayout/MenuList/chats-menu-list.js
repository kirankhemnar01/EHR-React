import { useParams } from 'react-router-dom';

import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';

// project imports
import NavGroup from './NavGroup';
import { useAidaChatRooms } from 'hooks/useAida';

const ChatsMenuList = () => {
  const { projectId } = useParams();

  const chatRooms = useAidaChatRooms();
  if (!projectId || !chatRooms) return null;

  const chatMenu = {
    id: 'chatsMenuItems',
    type: 'group',
    children: [
      {
        id: 'chats',
        title: 'Chats',
        type: 'collapse',
        alwaysOpen: true,
        url: '',
        icon: ForumOutlinedIcon,
        children: chatRooms.map((room) => {
          const item = {
            id: room.room_id,
            title: room.room_name,
            url: `/projects/${projectId}/chat-rooms/${room.room_id}`,
            type: 'chats-menu-item',
            projectId,
            roomId: room.room_id,
            breadcrumbs: false
          };
          return item;
        }),
        breadcrumbs: false
      }
    ]
  };

  return <NavGroup key={chatMenu.id} item={chatMenu} remItems={[]} noDivider />;
};

export default ChatsMenuList;
