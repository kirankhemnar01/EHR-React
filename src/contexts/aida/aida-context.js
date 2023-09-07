import { createContext, useCallback, useEffect, useReducer, useState } from 'react';
import aidaReducer, { initialState } from './aida-reducer';
import { PROJECTS_LOADED, SET_CURRENT_PROJECT, CUSTODIANS_LOADED, REVIEWERS_LOADED } from './aida-actions';
import useAuth from 'hooks/useAuth';

import { useTagGroups } from 'service/tags';
import { useChatRooms } from 'service/chat';
import * as ProjectApis from 'service/projects/apis';
import { sentryException } from 'helpers';
import { sentryEvents, SITE_DEPOSITION } from 'aida-constants';
import { useSelector } from 'store';

const AidaContext = createContext(null);

export const AidaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(aidaReducer, initialState);
  const { currentProjectId: originalcurrentProjectId } = state;
  const currentSiteId = useSelector((state) => state.menu.currentSiteId);
  let currentProjectId = originalcurrentProjectId;
  if (currentSiteId === SITE_DEPOSITION && originalcurrentProjectId)
    currentProjectId = `${originalcurrentProjectId}_deposition`;

  const tagGroups = useTagGroups(currentProjectId);
  const { user } = useAuth();
  const chatRooms = useChatRooms(currentProjectId, user?.user_id);
  const [detail, setDetail] = useState(null);

  const captureException = sentryException(user);
  // load project list
  useEffect(() => {
    const init = async () => {
      try {
        const { results: projects } = await ProjectApis.getProjects();
        dispatch({
          type: PROJECTS_LOADED,
          payload: { projects }
        });
      } catch (err) {
        captureException(err, {
          userEvent: sentryEvents.sys.getProjects
        });
        console.log(err);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load all data
  useEffect(() => {
    const init = async () => {
      if (currentProjectId) {
        try {
          const { results: custodians } = await ProjectApis.getCustodians(currentProjectId);
          dispatch({
            type: CUSTODIANS_LOADED,
            payload: { custodians }
          });

          const { results: reviewers } = await ProjectApis.getReviewers(currentProjectId);
          dispatch({
            type: REVIEWERS_LOADED,
            payload: { reviewers }
          });
        } catch (err) {
          captureException(err, {
            userEvent: sentryEvents.sys.getReviewersCustodians,
            projectId: currentProjectId
          });
          console.log('Load reviewers and custodians: ', err);
        }
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProjectId]);

  const refetch = useCallback(async (projectId) => {
    if (projectId) {
      try {
        const { results: custodians } = await ProjectApis.getCustodians(projectId);
        dispatch({
          type: CUSTODIANS_LOADED,
          payload: { custodians }
        });
      } catch (err) {
        console.log('Load custodians: ', err);
      }
    }
  }, []);

  const setCurrentProjectId = (currentProjectId) => {
    dispatch({
      type: SET_CURRENT_PROJECT,
      payload: { currentProjectId }
    });
  };

  const getCurrentProjectIdName = () => {
    const { projects, currentProjectId } = state;
    if (currentProjectId) {
      const p = projects.find((project) => project.case_id === currentProjectId);
      if (p) return [currentProjectId, p.name];
      return [currentProjectId, currentProjectId];
    }
    return ['', ''];
  };

  const getTagDefinitionById = (tagId, tagGroups) => {
    if (tagGroups) {
      for (let i = 0, len = tagGroups.length; i < len; i += 1) {
        const tagGroup = tagGroups[i];
        const tag = tagGroup.tags.find((tag) => tag.tag_id === tagId);
        if (tag) return tag;
      }
    }
    return null;
  };

  const getDetailInfo = () => detail;
  const setDetailInfo = (title, link) => setDetail({ title, link });
  const clearDetailInfo = () => setDetail(null);

  return (
    <AidaContext.Provider
      value={{
        ...state,
        tagGroups,
        chatRooms,
        setCurrentProjectId,
        getCurrentProjectIdName,
        getTagDefinitionById,
        getDetailInfo,
        setDetailInfo,
        clearDetailInfo,
        refetch
      }}
    >
      {children}
    </AidaContext.Provider>
  );
};

export default AidaContext;
