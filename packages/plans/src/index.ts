import fs from 'fs';
import { join } from 'path';
import http, { HttpClient } from 'isomorphic-git/http/node';
import { loadPlansFromUserPath } from './services/plans/plans.actions';
import { init as initStorage } from './services/storage/storage.service';
import { AppThunk, createStore } from './store';
import { FS } from './shared.types';

export { reducer } from './store';

export const start = ({
  fs,
  rootPath,
}: {
  fs: FS;
  http: HttpClient;
  rootPath: string;
}): AppThunk => async dispatch => {
  dispatch(initStorage());
  dispatch(
    loadPlansFromUserPath({
      fs,
      userDirectoryPath: join(rootPath, 'bob'),
      userId: 'bob',
    })
  );
};

export const startWithPackageStore = ({
  fs,
  http,
  rootPath,
}: {
  fs: FS;
  http: HttpClient;
  rootPath: string;
}) => {
  const store = createStore();
  store.dispatch(start({ fs, http, rootPath }));
};

if (process.env.NODE_ENV === 'development') {
  if (typeof process.env.ROOT_PATH === 'string') {
    const { ROOT_PATH } = process.env;
    console.log('Starting with ROOT_PATH #2Yc8PN', ROOT_PATH);
    startWithPackageStore({ fs, http, rootPath: ROOT_PATH });
  }
}
