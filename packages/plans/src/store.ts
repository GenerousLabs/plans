import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import devToolsEnhancer, {
  RemoteReduxDevToolsOptions,
} from 'remote-redux-devtools';
import plans, { REDUCER_KEY as plansKey } from './services/plans/plans.state';
import repos, { REDUCER_KEY as reposKey } from './services/repos/repos.state';

export const REDUX_ROOT_KEY = '__plans' as const;

export const reducer = combineReducers({
  [plansKey]: plans,
  [reposKey]: repos,
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
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

/**
 * Get the state for this package from a top level redux store
 */
export const getLocalState = (state: RootState) => state[REDUX_ROOT_KEY];
