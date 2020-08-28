import { describe, expect, it } from 'jest-without-globals';
import {
  getPlanDataFromIndexFilePath,
  getPlanFilesFromDirectory,
  writePlanToDisk,
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

  describe('writePlanToDisk()', () => {
    it('Write a plan to disk #oQvE2B', async () => {
      const fs = f.createDefaultMockFilesystem();

      const expectedContents = f.joinFrontmatter(f.pia);

      await writePlanToDisk({
        fs,
        // TODO There's like a better directory to use here
        folderPath: '/daniella/plans/empty/',
        plan: {
          description: f.pia.markdown,
          name: f.pia.data.name,
          slug: f.pia.slug,
        },
      });

      expect(
        await fs.promises.readFile(
          `/daniella/plans/empty/${f.pia.slug}/index.md`,
          { encoding: 'utf8' }
        )
      ).toEqual(expectedContents);
    });
  });
});
