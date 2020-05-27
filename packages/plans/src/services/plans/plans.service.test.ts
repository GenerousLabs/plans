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

import {
  joinFrontmatter,
  bob,
  charlie,
  nordvpn,
  spotify,
  omgyes,
} from './plans.fixtures';

describe('plans service', () => {
  describe('readPlansFileContents()', () => {
    beforeEach(() => {
      mockFs({
        'alice/': {
          [bob.slug]: {
            'index.md': joinFrontmatter(bob),
            plans: {
              [spotify.slug]: {
                'index.md': joinFrontmatter(spotify),
              },
              [nordvpn.slug]: {
                'index.md': joinFrontmatter(nordvpn),
              },
            },
          },
          charlie: {
            'index.md': joinFrontmatter(charlie),
            plans: {
              [omgyes.slug]: {
                'index.md': joinFrontmatter(omgyes),
              },
            },
          },
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
          data: nordvpn.data,
          content: nordvpn.markdown,
          messagesContent: [],
        },
        {
          slug: spotify.slug,
          data: spotify.data,
          content: spotify.markdown,
          messagesContent: [],
        },
      ]);
    });
  });
});
