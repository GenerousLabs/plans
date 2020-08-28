import { describe, expect, it } from 'jest-without-globals';
import * as f from '../fixtures';
import { startup } from '../services/startup/actions/startup.action';
import { ME_MOCK_REMOTE } from '../shared.constants';
import '../utils/time.utils';

const TIMEOUT = 60e3;

let start = 1591281210;
jest.mock('../utils/time.utils', () => {
  return {
    timestampSeconds: () => {
      const d = new Date(start);
      // Add 10s to each call
      start = start + 10;
      return Math.round(d.getTime() / 1e3);
    },
  };
});

describe('redux e2e', () => {
  describe('init', () => {
    it(
      'boots without error #4iRln0',
      async () => {
        const { fs, http, store } = await f.mocksWithClonedMeRepo();

        // NOTE: Jest automatically fails the test if it throws
        await store.dispatch(
          startup({
            fs,
            http,
            rootConfig: {
              meRepoRemote: ME_MOCK_REMOTE,
              path: '/e2e',
            },
          })
        );
      },
      TIMEOUT
    );

    it(
      'Produces a consistent state #uvVYtC',
      async () => {
        const { fs, http, store } = await f.mocksWithClonedMeRepo();

        await store.dispatch(
          startup({
            fs,
            http,
            rootConfig: {
              meRepoRemote: ME_MOCK_REMOTE,
              path: '/e2e',
            },
          })
        );

        expect(store.getState()).toMatchSnapshot();
      },
      TIMEOUT
    );
  });
});
