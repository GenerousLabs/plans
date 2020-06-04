import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'jest-without-globals';
import * as f from '../fixtures';
import { saveNewMessage } from '../services/plans/actions/saveNewMessage.action';
import { startup } from '../services/startup/actions/startup.action';
import { createStore } from '../store';

// let store: EnhancedStore<RootState, AnyAction>;
let store: ReturnType<typeof createStore>;

const meMockRemote = 'http://localhost:8174/me.git';
const timeout = 60e3;

describe('redux e2e', () => {
  beforeEach(async () => {
    f.mockFilesystem();
    store = createStore({ enableDevTools: false, enableRemoteDevTools: false });
    return;
    const dir = 'e2e/me';
    console.error('start #Kx0D8J');
    await git.clone({ fs, http, dir, url: meMockRemote });
    console.error('second #ByOw7Y');
  });
  afterEach(() => {
    f.mockFilesystemRestore();
  });

  describe('init', () => {
    it(
      'boots without error #4iRln0',
      async () => {
        // NOTE: Jest automatically fails the test if it throws
        await store.dispatch(
          startup({
            fs,
            http,
            rootConfig: {
              meRepoRemote: meMockRemote,
              path: 'e2e',
            },
          })
        );
      },
      timeout
    );
  });

  describe('saveNewMessage()', () => {
    it('saves a new message #qST95r', async () => {
      await store.dispatch(
        startup({
          fs,
          http,
          rootConfig: {
            meRepoRemote: meMockRemote,
            path: 'e2e',
          },
        })
      );

      await store.dispatch(
        saveNewMessage({
          fs,
          http,
          contentMarkdown: f.testMessage.markdown,
          dateTimestampSeconds: f.testMessage.data.dateTimestampSeconds,
          dir: 'e2e/connections/bob/plans/bob/nordvpn',
          planId: 'e2e/connections/bob/plans/bob/nordvpn/index.md',
        })
      );

      const expectedContents = `${f.joinFrontmatter(f.testMessage)}\n`;

      expect(
        await fs.promises.readFile(
          `e2e/connections/bob/plans/bob/nordvpn/message-${f.testMessage.data.dateTimestampSeconds}.md`,
          { encoding: 'utf8' }
        )
      ).toEqual(expectedContents);
    });
  });
});
