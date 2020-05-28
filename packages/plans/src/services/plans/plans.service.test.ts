import { promises as fs } from 'fs';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'jest-without-globals';
import { join } from 'path';
import * as f from '../../fixtures';
import {
  getPlanFilesFromDirectory,
  getPlanDataFromIndexFilePath,
  readPlansFromUserPlansDirectory,
} from './plans.service';

describe('plans service', () => {
  beforeEach(() => {
    f.mockFilesystem();
  });

  afterEach(() => {
    f.mockFilesystemRestore();
  });

  describe('getPlanFilesFromDirectory()', () => {
    it('Retrieves correct file list #O3ztrx', async () => {
      expect(
        await getPlanFilesFromDirectory({
          fs,
          path: 'alice/charlie/plans/omgyes',
        })
      ).toMatchSnapshot();
    });

    it('Throws when directory does not contain index.md', async () => {
      await expect(
        getPlanFilesFromDirectory({
          fs,
          path: 'daniella/plans/empty',
        })
      ).rejects.toThrow();
    });
  });

  describe('getPlanDataFromIndexFilePath()', () => {
    it('Fetches data from plan index file #DakdZI', async () => {
      expect(
        await getPlanDataFromIndexFilePath({
          fs,
          path: 'alice/charlie/plans/omgyes/index.md',
        })
      ).toMatchSnapshot();
    });
  });

  describe('readPlansFromUserPlansDirectory()', () => {
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
            {
              ...f.aliceMessage.data,
              contentMarkdown: f.aliceMessage.markdown,
              slug: `message-${f.aliceMessage.data.dateTimestampSeconds}.md`,
            },
            {
              ...f.charlieMessage.data,
              contentMarkdown: f.charlieMessage.markdown,
              slug: `message-${f.charlieMessage.data.dateTimestampSeconds}.md`,
            },
          ],
        },
      ]);
    });
  });
});
