import { store } from './store';

import { init } from './services/storage/storage.service';

export const start = async () => {
  console.log('Start #OlwQwc');

  store.dispatch(init());
};

start();
