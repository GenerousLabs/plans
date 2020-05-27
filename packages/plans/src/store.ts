import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import devToolsEnhancer from 'remote-redux-devtools';

import storage from './services/storage/storage.service';
import plans from './services/plans/plans.state';

const REDUX_ROOT_KEY = '__plans' as const;

const reducer = combineReducers({
  storage,
  plans,
});

export const store = configureStore({
  reducer: {
    [REDUX_ROOT_KEY]: reducer,
  },
  devTools: false,
  enhancers: [
    devToolsEnhancer({ hostname: 'localhost', port: 8000, realtime: true }),
  ],
});

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
