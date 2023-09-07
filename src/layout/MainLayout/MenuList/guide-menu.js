import ImportContactsOutlined from '@mui/icons-material/ImportContactsOutlined';
import NavItem from './NavItem';

export const UserGuideLink = () => (
  <NavItem
    item={{
      icon: ImportContactsOutlined,
      url: 'https://docs.laer.ai',
      target: '_blank',
      title: 'User Guide',
      external: true
    }}
    level={1}
    sx={{
      alignItems: 'center',
      '&:hover': { bgcolor: 'transparent' },
      flexGrow: 0,
      width: 'calc(100% - 32px)'
    }}
  />
);
