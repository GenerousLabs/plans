import fs from 'fs';
import isomorphicGitHttp from 'isomorphic-git/http/node';
import { GitParams } from '../../shared.types';
import { createStore } from '../../store';
import { startup } from './actions/startup.action';
import { saveNewMessage } from '../plans/actions/saveNewMessage.action';

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

    const run = async () => {
      const http = isomorphicGitHttp;

      const store = await startWithLocalStore({
        fs,
        http,
        rootConfig: {
          path: ROOT_PATH,
          meRepoRemote: '',
          meRepoHeaders: headers,
        },
      });

      return;

      store.dispatch({ type: 'test start #MNg4Ud' });

      const rootState = store.getState();
      const planId = rootState.__plans.plans.plans.ids[0];
      const plan = rootState.__plans.plans.plans.entities[planId];

      if (typeof plan === 'undefined') {
        store.dispatch({ type: 'Stop #000d9j' });
        return;
      }

      await store.dispatch(
        saveNewMessage({
          fs,
          http,
          headers,
          contentMarkdown: 'A simple test message',
          dir: plan.path,
          planId: plan.id,
        })
      );

      store.dispatch({ type: 'test finish #IaZi0D' });
    };

    run();
  }
}
