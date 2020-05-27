import { promises as fs } from 'fs';
import { join } from 'path';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from 'jest-without-globals';

import { readPlansFromUserPlansDirectory } from './plans.service';

import * as f from './plans.fixtures';

describe('plans service', () => {
  describe('readPlansFromUserPlansDirectory()', () => {
    beforeEach(() => {
      f.mockFilesystem();
    });

    afterEach(() => {
      f.mockFilesystemRestore();
    });

    it('Reads a directory #BiRYi7', async () => {
      expect(
        // NOTE: We need to await the test otherwise the `afterAll()` will
        // destroy our mock filesystem while the async code is still running.
        await readPlansFromUserPlansDirectory({
          fs,
          directoryPath: join(process.cwd(), 'alice/bob/plans/'),
        })
      ).toEqual([
        {
          ...f.nordvpn.data,
          slug: f.nordvpn.slug,
          descriptionMarkdown: f.nordvpn.markdown,
          messages: [],
        },
        {
          ...f.spotify.data,
          slug: f.spotify.slug,
          descriptionMarkdown: f.spotify.markdown,
          messages: [],
        },
      ]);
    });

    it('Reads a directory with messages #WOK5tu', async () => {
      expect(
        // NOTE: We need to await the test otherwise the `afterAll()` will
        // destroy our mock filesystem while the async code is still running.
        await readPlansFromUserPlansDirectory({
          fs,
          directoryPath: join(process.cwd(), 'alice/charlie/plans/'),
        })
      ).toEqual([
        {
          ...f.omgyes.data,
          slug: f.omgyes.slug,
          descriptionMarkdown: f.omgyes.markdown,
          messages: [
            { ...f.aliceMessage.data, content: f.aliceMessage.markdown },
            { ...f.charlieMessage.data, content: f.charlieMessage.markdown },
          ],
        },
      ]);
    });
  });
});
