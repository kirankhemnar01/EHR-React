import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { ContextMenu } from 'ui-component/aida/base';

const menuItems = [
  { key: 'asc', title: 'Sort asc', icon: ArrowUpwardIcon, group: 'sort' },
  { key: 'desc', title: 'Sort desc', icon: ArrowDownwardIcon, group: 'sort' },
  { key: 'group', title: 'Group by', icon: FolderOutlinedIcon, group: 'group' },
];
export const SortGroupMenu = ({ anchorEl, open, onClose, onMenu, menusFor }) => (
  <ContextMenu
    items={menuItems.filter(item => menusFor.includes(item.group))}
    {...{ anchorEl, onClose, onMenu, open }}
  />
);
