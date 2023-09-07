import { Box } from '@mui/material';
import { Timeline, timelineItemClasses } from '@mui/lab';
import { UploadProcessingBar } from './upload-processing-bar';
import { ProcessingItem } from './processing-item';

export const UploadProcessReport = ({ projectId, uploadId, runUpload, cancelUpload, downloadLog, steps, status, onReload }) => {
  if (!steps || !steps.length) {
    return <div>No Data</div>;
  }

  return (
    <Box>
      <UploadProcessingBar {...{ status, onReload, projectId, uploadId, runUpload, cancelUpload, downloadLog }} />

      <Timeline
        position='right'
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
          }
        }}>
        {steps.map((item, idx) => (
          <ProcessingItem key={item.index} data={item} isLast={idx === (steps.length - 1)} />
        ))}
      </Timeline>
    </Box >
  )
}
