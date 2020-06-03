import fs from 'fs';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'jest-without-globals';
import * as f from '../../../../fixtures';
import { getMessageDataFromPath } from './messages.service';

describe('messages.service', () => {
  beforeEach(() => {
    f.mockFilesystem();
  });

  afterEach(() => {
    f.mockFilesystemRestore();
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
