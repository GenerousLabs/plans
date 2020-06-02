import fs from 'fs';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'jest-without-globals';
import * as f from '../../fixtures';
import {
  getMessageDataFromPath,
  getPlanDataFromIndexFilePath,
  getPlanFilesFromDirectory,
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
          path: 'alice/charlie/plans/charlie/omgyes',
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
          path: 'alice/charlie/plans/charlie/omgyes/index.md',
        })
      ).toMatchSnapshot();
    });
  });

  describe('getMessageDataFromPath()', () => {
    it('Fetches message data correctly #OtOeRY', async () => {
      expect(
        await getMessageDataFromPath({
          fs,
          path: 'alice/charlie/plans/charlie/omgyes/message-1590595620.md',
        })
      ).toMatchSnapshot();
    });

    it('Throws on empty file', async () => {
      await expect(
        getMessageDataFromPath({
          fs,
          path: 'elena/index.md',
        })
      ).rejects.toThrow();
    });
  });
});
