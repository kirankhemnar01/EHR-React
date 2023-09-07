import { useState } from 'react';
import { Box, Drawer } from '@mui/material';
import { useDocPreview } from 'ui-component/aida/doc-preview';
import { TasksTable } from './tasks-table';

export const Tasks = ({ projectId }) => {
  const [docId, setDocId] = useState(null);

  const onPreview = (doc) => setDocId(doc.doc_id);
  const closePreview = () => setDocId(null);

  const [header, body] = useDocPreview(projectId, docId, closePreview);

  return (
    <>
      <TasksTable onPreview={onPreview} />

      <Drawer anchor="right" open={!!docId} onClose={closePreview}>
        <Box sx={{ width: 640, maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 3,
              bgcolor: '#E0F2FE'
            }}
          >
            {header}
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', position: 'relative', p: 0 }}>{body}</Box>
        </Box>
      </Drawer>
    </>
  );
};
