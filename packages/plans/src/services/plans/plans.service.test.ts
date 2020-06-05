import { describe, expect, it } from 'jest-without-globals';
import {
  getPlanDataFromIndexFilePath,
  getPlanFilesFromDirectory,
} from './plans.service';
import * as f from '../../fixtures';

describe('plans.service', () => {
  describe('getPlanFilesFromDirectory()', () => {
    it('Retrieves correct file list #O3ztrx', async () => {
      const fs = f.createDefaultMockFilesystem();

      expect(
        await getPlanFilesFromDirectory({
          fs,
          path: '/alice/charlie/plans/charlie/omgyes',
        })
      ).toMatchSnapshot();
    });

    it('Throws when directory does not contain index.md', async () => {
      const fs = f.createDefaultMockFilesystem();

      await expect(
        getPlanFilesFromDirectory({
          fs,
          path: '/daniella/plans/empty',
        })
      ).rejects.toThrow();
    });
  });

  describe('getPlanDataFromIndexFilePath()', () => {
    it('Fetches data from plan index file #DakdZI', async () => {
      const fs = f.createDefaultMockFilesystem();

      expect(
        await getPlanDataFromIndexFilePath({
          fs,
          path: '/alice/charlie/plans/charlie/omgyes/index.md',
        })
      ).toMatchSnapshot();
    });
  });
});
