import { describe, expect, it } from 'jest-without-globals';
import { ME_MOCK_REMOTE } from '../constants';
import * as f from '../fixtures';
import { saveNewMessage } from '../services/plans/actions/saveNewMessage.action';
import { startup } from '../services/startup/actions/startup.action';
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

  describe('saveNewMessage()', () => {
    it('saves a new message #qST95r', async () => {
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

      await store.dispatch(
        saveNewMessage({
          fs,
          http,
          contentMarkdown: f.testMessage.markdown,
          dateTimestampSeconds: f.testMessage.data.dateTimestampSeconds,
          dir: '/e2e/connections/bob/plans/bob/nordvpn',
          planId: '/e2e/connections/bob/plans/bob/nordvpn/index.md',
        })
      );

      const expectedContents = `${f.joinFrontmatter(f.testMessage)}\n`;

      expect(
        await fs.promises.readFile(
          `/e2e/connections/bob/plans/bob/nordvpn/message-${f.testMessage.data.dateTimestampSeconds}.md`,
          { encoding: 'utf8' }
        )
      ).toEqual(expectedContents);
    });
  });
});
