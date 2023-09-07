import { useState, useCallback } from 'react';

import HighlightsContext from './context';
import { useDocHighlights, createDocHighlight, updateDocHighlight, deleteDocHighlight } from 'service/docview';
import { captureException } from '@sentry/react';
import { sentryEvents } from 'aida-constants';
import { useNotification } from 'hooks/use-notification';

export const DocHighlightsContextProvider = ({ projectId, docId, children }) => {
  const { data: highlightsData, loading, error, refetch } = useDocHighlights(projectId, docId);
  const { notifyError } = useNotification();

  const [curHighlightId, setCurHighlightId] = useState(-1);
  const [hideAllHighlights, setHideAllHighlights] = useState(false);

  const onCreate = useCallback(
    async ({ textSpan, color, text, comment, tags }) => {
      try {
        await createDocHighlight({ projectId, docId, textSpan, color, text, comment, tags });
        await refetch();
      } catch (e) {
        notifyError('Failed to create highlight.');
        captureException(e, {
          userEvent: sentryEvents.documentAnnotation.createDocHighlight,
          projectId,
          docId,
          textSpan,
          color,
          text,
          comment,
          tags
        });
        console.error(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId, docId, refetch]
  );

  const onUpdate = useCallback(
    async ({ highlightId, textSpan, color, text, comment, tags }) => {
      try {
        await updateDocHighlight({
          projectId,
          docId,
          highlightId,
          textSpan,
          color,
          text,
          comment,
          tags
        });
        await refetch();
      } catch (e) {
        notifyError('Failed to update highlight.');
        captureException(e, {
          userEvent: sentryEvents.documentAnnotation.updateDocHighlight,
          projectId,
          docId,
          textSpan,
          color,
          text,
          comment,
          tags
        });
        console.error(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId, docId, refetch]
  );

  const onDelete = useCallback(
    async ({ highlightId }) => {
      try {
        await deleteDocHighlight({ projectId, highlightId });
        await refetch();
      } catch (e) {
        notifyError('Failed to delete highlight.');
        captureException(e, {
          userEvent: sentryEvents.documentAnnotation.deleteDocHighlight,
          projectId,
          docId
        });
        console.error(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId, docId, refetch]
  );

  const scrollToHighlightText = useCallback((highlight) => {
    const elems = document.getElementsByClassName(`generic-highlight-id-${highlight?.id}`);
    if (elems.length > 0) elems[0].scrollIntoView();
  }, []);

  return (
    <HighlightsContext.Provider
      value={{
        projectId,
        docId,
        highlightsData,
        loading,
        error,
        onCreate,
        onUpdate,
        onDelete,
        curHighlightId,
        setCurHighlightId,
        hideAllHighlights,
        setHideAllHighlights,
        scrollToHighlightText
      }}
    >
      {children}
    </HighlightsContext.Provider>
  );
};
