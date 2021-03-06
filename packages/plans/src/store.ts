import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import devToolsEnhancer, {
  RemoteReduxDevToolsOptions,
} from 'remote-redux-devtools';
import config, {
  REDUCER_KEY as configKey,
} from './services/config/config.state';
import me, { REDUCER_KEY as meKey } from './services/me/me.state';
import plans, { REDUCER_KEY as plansKey } from './services/plans/plans.state';
import startup, {
  REDUCER_KEY as startupKey,
} from './services/startup/startup.state';
import { REDUX_ROOT_KEY } from './shared.constants';

export const reducer = combineReducers({
  [configKey]: config,
  [meKey]: me,
  [plansKey]: plans,
  [startupKey]: startup,
});

export const createStore = (args?: {
  enableDevTools?: boolean;
  enableRemoteDevTools?: boolean;
  devToolsEnhancerArgs?: RemoteReduxDevToolsOptions;
}) => {
  const {
    enableDevTools = false,
    enableRemoteDevTools = true,
    devToolsEnhancerArgs = {
      hostname: 'localhost',
      port: 8000,
      realtime: true,
    },
  } = typeof args === 'undefined' ? {} : args;

  const enhancers = [];
  if (enableRemoteDevTools) {
    enhancers.push(devToolsEnhancer(devToolsEnhancerArgs));
  }

  const store = configureStore({
    reducer: {
      [REDUX_ROOT_KEY]: reducer,
    },
    devTools: enableDevTools,
    enhancers,
  });

  return store;
};

// export type RootState = ReturnType<typeof store.getState>;
export type RootState = {
  [REDUX_ROOT_KEY]: ReturnType<typeof reducer>;
};
export type RootDispatch = ReturnType<typeof createStore>['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
// This type is a helper to pass to the 3rd generic type of
// `createAsyncThunk()`, see docs:
// https://redux-toolkit.js.org/usage/usage-with-typescript/#createasyncthunk
export type RootThunkApi = {
  state: RootState;
  dispatch: RootDispatch;
};

/**
 * Get the state for this package from a top level redux store
 */
export const getPackageState = (state: RootState) => state[REDUX_ROOT_KEY];
