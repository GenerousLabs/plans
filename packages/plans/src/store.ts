import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import devToolsEnhancer from 'remote-redux-devtools';

import storage from './services/storage/storage.service';

export const store = configureStore({
  reducer: {
    storage,
  },
  devTools: false,
  enhancers: [
    devToolsEnhancer({ hostname: 'localhost', port: 8000, realtime: true }),
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
