import { store } from './store';

import { init } from './services/storage/storage.service';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};

store.dispatch(init());
