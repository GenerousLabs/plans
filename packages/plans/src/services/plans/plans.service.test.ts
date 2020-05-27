import mockFs from 'mock-fs';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from 'jest-without-globals';

import { readPlansFileContents } from './plans.service';

const spotifyMarkdown = `---
name: Spotify
---
I have two spots on my family plan.
`;
const nordvpnMarkdown = `---
name: NordVPN
---
I can use 6 devices at the same time
`;

describe('plans service', () => {
  describe('readPlans()', () => {
    beforeEach(() => {
      mockFs({
        'alice/bob/plans': {
          sptofy: { 'index.md': spotifyMarkdown },
          nordvpn: { 'index.md': nordvpnMarkdown },
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Reads a directory #BiRYi7', async () => {
      expect(
        // NOTE: We need to await the test otherwise the `afterAll()` will
        // destroy our mock filesystem while the async code is still running.
        await readPlansFileContents({
          fs,
          directoryPath: join(process.cwd(), 'alice/bob/plans/'),
        })
      ).toEqual([
        { indexContent: nordvpnMarkdown, messagesContent: [] },
        { indexContent: spotifyMarkdown, messagesContent: [] },
      ]);
    });
  });
});
