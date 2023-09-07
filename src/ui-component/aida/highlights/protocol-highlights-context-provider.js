import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import HighlightsContext from './context';
import {
  useProtocolHighlights,
  createProtocolHighlight,
  updateProtocolHighlight,
  deleteProtocolHighlight
} from 'service/protocols';
import { captureException } from '@sentry/react';
import { sentryEvents, PROTOCOL_HIGHLIGHT_IFRAME_ID } from 'aida-constants';
import { useNotification } from 'hooks/use-notification';

export const ProtocolHighlightsContextProvider = ({ protocolId, version, children }) => {
  const { projectId } = useParams();
  const { data: highlightsData, loading, error, refetch } = useProtocolHighlights(projectId, protocolId, version);
  const { notifyError } = useNotification();

  const [curHighlightId, setCurHighlightId] = useState(-1);
  const [hideAllHighlights, setHideAllHighlights] = useState(false);

  const onCreate = useCallback(
    async ({ textSpan, color, text, comment, tags }) => {
      try {
        await createProtocolHighlight({ projectId, protocolId, version, textSpan, color, text, comment, tags });
        await refetch();
      } catch (e) {
        notifyError('Failed to create highlight.');
        captureException(e, {
          userEvent: sentryEvents.protocols.createProtocolHighlight,
          projectId,
          protocolId,
          version,
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
    [projectId, protocolId, version, refetch]
  );

  const onUpdate = useCallback(
    async ({ highlightId, textSpan, color, text, comment, tags }) => {
      try {
        await updateProtocolHighlight({
          projectId,
          protocolId,
          version,
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
          userEvent: sentryEvents.protocols.updateProtocolHighlight,
          projectId,
          protocolId,
          version,
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
    [projectId, protocolId, version, refetch]
  );

  const onDelete = useCallback(
    async ({ highlightId }) => {
      try {
        await deleteProtocolHighlight({ projectId, highlightId });
        await refetch();
      } catch (e) {
        notifyError('Failed to delete highlight.');
        captureException(e, {
          userEvent: sentryEvents.protocols.deleteProtocolHighlight,
          projectId,
          protocolId
        });
        console.error(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId, protocolId, version, refetch]
  );

  const scrollToHighlightText = useCallback((highlight) => {
    const iframe = document.getElementById(PROTOCOL_HIGHLIGHT_IFRAME_ID);
    const e = iframe.contentDocument.querySelector(`[data-highlight-id="${highlight?.text_span?.id}"]`);
    if (e) e.scrollIntoView();
  }, []);

  return (
    <HighlightsContext.Provider
      value={{
        projectId,
        protocolId,
        version,
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
