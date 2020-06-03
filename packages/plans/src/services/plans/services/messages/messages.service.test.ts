import fs from 'fs';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'jest-without-globals';
import * as f from '../../../../fixtures';
import {
  getMessageDataFromPath,
  writeMessageToPlanDirectory,
} from './messages.service';

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

  describe('writeMessageToPlanDirectory()', () => {
    it('Successfully writes the message file #lpWGL7', async () => {
      const {
        markdown,
        data: { dateTimestampSeconds, sender },
      } = f.charlieMessage;

      await writeMessageToPlanDirectory({
        fs,
        planDirectoryPath: 'elena/',
        contentMarkdown: markdown,
        dateTimestampSeconds,
        sender,
      });

      const expectedFileContents = `${f.joinFrontmatter(f.charlieMessage)}\n`;

      expect(
        await fs.promises.readFile(`elena/message-${dateTimestampSeconds}.md`, {
          encoding: 'utf8',
        })
      ).toEqual(expectedFileContents);
    });

    it('Does not add a second trailing line break #JJBAfm', async () => {
      const {
        markdown,
        data: { dateTimestampSeconds, sender },
      } = f.charlieMessage;

      await writeMessageToPlanDirectory({
        fs,
        planDirectoryPath: 'elena/',
        // Single trailing line break
        contentMarkdown: `${markdown}\n`,
        dateTimestampSeconds,
        sender,
      });

      const expectedFileContents = `${f.joinFrontmatter(f.charlieMessage)}\n`;

      expect(
        await fs.promises.readFile(`elena/message-${dateTimestampSeconds}.md`, {
          encoding: 'utf8',
        })
      ).toEqual(expectedFileContents);
    });

    it('Will add a third line break #JJBAfm', async () => {
      const {
        markdown,
        data: { dateTimestampSeconds, sender },
      } = f.charlieMessage;

      await writeMessageToPlanDirectory({
        fs,
        planDirectoryPath: 'elena/',
        contentMarkdown: `${markdown}\n\n`,
        dateTimestampSeconds,
        sender,
      });

      const expectedFileContents = `${f.joinFrontmatter(f.charlieMessage)}\n\n`;

      expect(
        await fs.promises.readFile(`elena/message-${dateTimestampSeconds}.md`, {
          encoding: 'utf8',
        })
      ).toEqual(expectedFileContents);
    });
  });
});
