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

import { readPlans } from './plans.service';

describe('plans service', () => {
  describe('readPlans()', () => {
    beforeEach(() => {
      mockFs({
        'alice/bob/plans': {
          sptofy: { 'index.md': 'Spotify' },
          nordvpn: { 'index.md': 'NordVPN' },
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
        await readPlans({
          fs,
          directoryPath: join(process.cwd(), 'alice/bob/plans/'),
        })
      ).toEqual([
        { indexContent: 'NordVPN', messagesContent: [] },
        { indexContent: 'Spotify', messagesContent: [] },
      ]);
    });
  });
});
