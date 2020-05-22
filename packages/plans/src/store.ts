import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import storage from './services/storage/storage.service';

export const store = configureStore({
  reducer: {
    storage,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
