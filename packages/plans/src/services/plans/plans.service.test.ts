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

const spotify = {
  slug: 'spotify',
  markdown: `---
name: Spotify
---
I have two spots on my family plan.
`,
};
const nordvpn = {
  slug: 'nordvpn',
  markdown: `---
name: NordVPN
---
I can use 6 devices at the same time
`,
};

describe('plans service', () => {
  describe('readPlans()', () => {
    beforeEach(() => {
      mockFs({
        'alice/bob/plans': {
          [spotify.slug]: { 'index.md': spotify.markdown },
          [nordvpn.slug]: { 'index.md': nordvpn.markdown },
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
        {
          slug: nordvpn.slug,
          indexContent: nordvpn.markdown,
          messagesContent: [],
        },
        {
          slug: spotify.slug,
          indexContent: spotify.markdown,
          messagesContent: [],
        },
      ]);
    });
  });
});
