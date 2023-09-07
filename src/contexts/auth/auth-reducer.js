import AuthActions from './auth-actions';
import { saveState } from 'helpers/storage';

function reducer(state, action) {
  let newState;
  switch (action.type) {
    case AuthActions.setUser:
      newState = {           
        ...state,
        ...action.payload
      };
      break;
    case AuthActions.clearUser:
      newState = {
        user: null,
        tokens: null,
        permissions: null
      };
      break;
    default:
      return state;
  }

  saveState('user', newState);
  return newState;
}

export default reducer;
