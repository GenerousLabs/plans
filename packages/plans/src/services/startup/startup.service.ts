import fs from 'fs';
import isomorphicGitHttp from 'isomorphic-git/http/node';
import { GitParams } from '../../shared.types';
import { createStore } from '../../store';
import { startup } from './actions/startup.action';

export type RootConfig = {
  // A folder on disk to serve as a root for our set of repositories
  path: string;
  // The remote URL to fetch the "me" repo from
  meRepoRemote: string;
  // This allows us to authenticate against repo remotes
  meRepoHeaders?: {
    [x: string]: string;
  };
};

export const startWithLocalStore = async ({
  fs,
  http,
  rootConfig,
}: Omit<GitParams, 'dir' | 'headers'> & {
  rootConfig: RootConfig;
}) => {
  const {} = rootConfig;

  const store = createStore();
  await store.dispatch(
    startup({
      fs,
      http,
      rootConfig,
    })
  );

  return store;
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
    startWithLocalStore({
      fs,
      http: isomorphicGitHttp,
      rootConfig: {
        path: ROOT_PATH,
        meRepoRemote: '',
        meRepoHeaders: headers,
      },
    });
  }
}
