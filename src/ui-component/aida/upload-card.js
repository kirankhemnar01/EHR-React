import { CardContent, Typography, Box, SvgIcon } from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import { ItemCard } from 'ui-component/cards/item-card';
import { humanFileSize } from 'helpers/functions';
import { toSimpleDateString } from 'helpers';
import useAuth from 'hooks/useAuth';

export const UploadCard = ({ data, onMenu, onView }) => {
  const { user: { time_zone: timezone } } = useAuth();
  const { upload_id: id, number_of_docs: numDocs, volume_size: volSize } = data;

  return (
    <ItemCard {...{data, onMenu, onView}} titleWidth='100%' idField='upload_id'>
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontSize: '0.875rem', mb: 1 }}>Upload ID: #{id}</Typography>
        <Box component="section" sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SvgIcon component={InsertDriveFileOutlinedIcon} />
            <Typography sx={{ fontWeight: 600 }}>{numDocs.toLocaleString('en-US')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SvgIcon component={FolderZipOutlinedIcon} />
            <Typography sx={{ fontWeight: 600 }}>{humanFileSize(volSize)}</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography sx={{ fontSize: 12 }}>
            Created: {toSimpleDateString(data.date_created, timezone)}
            {data.created_by && ` by ${data.created_by.name}`}
          </Typography>
        </Box>
      </CardContent>
    </ItemCard>
  );
};
