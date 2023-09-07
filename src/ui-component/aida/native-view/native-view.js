import { useState, useEffect } from 'react';

import { Typography, CircularProgress, Link } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { sentryEvents } from 'aida-constants';
import { sentryException } from 'helpers/sentry';
import { PdfjsView } from './pdfjs-view';
import { MediaNativeView } from './media-native-view';
import { downloadDocument } from 'service/docview';
import { ErrorMessage } from '../base';
import { useTaskPendings } from 'hooks/use-task-pending';
import { useNotification } from 'hooks/use-notification';

const TIMEOUT_INTERVAL = 500; // 0.5s
const MAX_TIMES = 120; // total 1 minute

export const NativeView = ({ projectId, doc, nativeViewPathData, getPdfView }) => {
  const { user } = useAuth();
  const captureException = sentryException(user, projectId);
  const { notifyError } = useNotification();

  const { pdf_path: initPdfPath, media_path: initMediaPath } = doc;
  const { data, loading, error } = nativeViewPathData;
  const [generateTask, setGenerateTask] = useState(null);
  const [generateError, setGenerateError] = useState('');

  const [timedout, setTimedout] = useState(false);
  const [downloading, setDownloading] = useState(false);

  let mediaPath = initMediaPath;
  let pdfPath = initPdfPath;
  if (!data?.task_id || generateTask?.done) {
    if (data) {
      mediaPath = data?.media_path;
      pdfPath = data?.pdf_path;
    }
  }

  const { pendings, addPending, delPending } = useTaskPendings(TIMEOUT_INTERVAL, MAX_TIMES);
  useEffect(() => {
    const check = async () => {
      if (generateTask?.task_id) {
        const task = pendings.find((p) => p.taskId === generateTask.task_id);
        if (task?.status === 'SUCCESS') {
          delPending(generateTask?.task_id);
          setGenerateTask({ ...generateTask, task_id: null, done: true });
        } else if (task?.status === 'FAILURE') {
          const error = `Failed to check response regenration task's status(task ID: ${generateTask.task_id}).`;
          setGenerateError(error);
          captureException(error, {
            userEvent: sentryEvents.backgroundTasks.checkTaskStatus,
            taskId: generateTask.task_id
          });
          delPending(generateTask.task_id);
          setGenerateTask({ ...generateTask, task_id: null, done: true });
        } else if (task?.count > MAX_TIMES) {
          setTimedout(true);
          delPending(generateTask.task_id);
          setGenerateTask({ ...generateTask, task_id: null, done: true });
        }
      }
    };
    check();
  }, [pendings, delPending, generateTask, projectId, captureException]);

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      setDownloading(true);
      await downloadDocument({ projectId, docId: doc.doc_id, pathType: 'native_path' });
    } catch (e) {
      captureException(e, {
        userEvent: sentryEvents.documentAnnotation.downloadDocument,
        docId: doc.doc_id,
        pathType: 'native_path'
      });
      notifyError(`Failed to download native file, docId=${doc.doc_id}.`);
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (data?.task_id) {
      setGenerateTask(data);
      addPending(data.task_id);
    }
  }, [data, addPending]);

  if (timedout)
    return (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-wrap',
          p: 1
        }}
      >
        Native preview is not available. Please download the native document{' '}
        <Link sx={{ cursor: 'pointer' }} onClick={handleDownload}>
          here
        </Link>
        . {downloading && <CircularProgress sx={{ display: 'block' }} color="warning" size={32} m={1} />}
      </Typography>
    );

  if (error || generateError) {
    return <ErrorMessage error={error || generateError} />;
  }

  if (loading || (generateTask && !generateTask.done)) return <CircularProgress color="warning" size={32} m={1} />;

  if (mediaPath && (doc.file_type === 'audio' || doc.file_type === 'video'))
    return <MediaNativeView doc={{ ...doc, media_path: mediaPath }} />;

  if (pdfPath) {
    if (getPdfView) return getPdfView({ ...doc, pdf_path: pdfPath });
    return <PdfjsView doc={{ ...doc, pdf_path: pdfPath }} />;
  }

  return null;
};
