import fs from 'fs';
import isomorphicGitHttp from 'isomorphic-git/http/node';
import { init as initRepos } from './services/repos/repos.actions';
import { init as initStorage } from './services/storage/storage.service';
import { GitParams } from './shared.types';
import { AppThunk, createStore } from './store';
import { getSerializableError } from './utils/errors.utils';

export { reducer } from './store';

export const start = ({
  fs,
  http,
  headers,
  rootPath,
}: Omit<GitParams, 'dir'> & {
  rootPath: string;
}): AppThunk => async dispatch => {
  dispatch(initStorage());

  try {
    await dispatch(initRepos({ fs, http, headers, rootPath }));
  } catch (error) {
    dispatch({
      type: 'PLANS/init/error',
      payload: {
        code: '#YFjhvS',
        message: 'Unknown error during initRepos() startup',
        params: {
          error: getSerializableError(error),
        },
      },
    });
  }
};

export const startWithPackageStore = ({
  fs,
  http,
  headers,
  rootPath,
}: Omit<GitParams, 'dir'> & {
  rootPath: string;
}) => {
  const store = createStore();
  store.dispatch(start({ fs, http, headers, rootPath }));
};

if (process.env.NODE_ENV === 'development') {
  if (typeof process.env.ROOT_PATH === 'string') {
    const { ROOT_PATH } = process.env;
    console.log('Starting with ROOT_PATH #2Yc8PN', ROOT_PATH);
    const { AUTH } = process.env;
    const headers =
      typeof AUTH === 'string'
        ? {
            Authorization: `Basic ${Buffer.from(AUTH).toString('base64')}`,
          }
        : undefined;
    console.log('Headers set #T3n8hi', headers);
    startWithPackageStore({
      fs,
      http: isomorphicGitHttp,
      rootPath: ROOT_PATH,
      headers,
    });
  }
}
