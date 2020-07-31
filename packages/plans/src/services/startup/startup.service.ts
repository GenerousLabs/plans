import isomorphicGitHttp from 'isomorphic-git/http/node';
import { fs } from 'memfs';
import { ME_MOCK_REMOTE } from '../../shared.constants';
import { FS, GitParams } from '../../shared.types';
import { createStore } from '../../store';
import { startup } from './actions/startup.action';
import mkdirp from 'mkdirp';

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

const getMemfs = () => {
  return (fs as unknown) as FS;
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
  if (typeof process.env.BOOT_LOCAL_STORE === 'string') {
    console.log('Starting with local store / memfs #2Yc8PN');

    const run = async () => {
      const http = isomorphicGitHttp;
      const fs = getMemfs();
      // NOTE: We need to cast `fs` to any here because our FS spec doesn't
      // include the non promised versions, which `mkdirp()` uses.
      await mkdirp('/connections/', { fs: fs as any });

      // const store = await startWithLocalStore({
      await startWithLocalStore({
        fs,
        http,
        rootConfig: {
          path: '/',
          meRepoRemote: ME_MOCK_REMOTE,
        },
      });
    };

    run();
  }
}
