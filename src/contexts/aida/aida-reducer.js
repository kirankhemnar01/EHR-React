// action - state management
import {
  PROJECTS_LOADED,
  SET_CURRENT_PROJECT,
  TAG_GROUPS_LOADED,
  CUSTODIANS_LOADED,
  REVIEWERS_LOADED
} from './aida-actions';

// ==============================|| Aida REDUCER ||============================== //

export const initialState = {
  projects: [],
  currentProjectId: '',
  tagGroups: {},
  custodians: [],
  reviewers: {}
};

const aidaReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECTS_LOADED: {
      const { projects } = action.payload;
      return {
        ...state,
        projects
      };
    }
    case SET_CURRENT_PROJECT: {
      const { currentProjectId } = action.payload;
      if (currentProjectId !== state.currentProjectId)
        return {
          ...state,
          currentProjectId
        };
      return state;
    }
    case TAG_GROUPS_LOADED: {
      const { tagGroups } = action.payload;
      return {
        ...state,
        tagGroups
      };
    }
    case REVIEWERS_LOADED: {
      const reviewers = {};
      const { reviewers: all } = action.payload;
      all.forEach((r) => {
        reviewers[r.user_id] = { ...r, reviewer_id: r.user_id };
      });
      return {
        ...state,
        reviewers
      };
    }
    case CUSTODIANS_LOADED: {
      const { custodians } = action.payload;
      return {
        ...state,
        custodians
      };
    }
    default: {
      return state;
    }
  }
};

export default aidaReducer;
