import { describe, expect, it } from 'jest-without-globals';
import * as f from '../../../../fixtures';
import {
  getMessageDataFromPath,
  writeMessageToPlanDirectory,
} from './messages.service';

describe('messages.service', () => {
  describe('getMessageDataFromPath()', () => {
    it('Fetches message data correctly #OtOeRY', async () => {
      const fs = f.createDefaultMockFilesystem();

      expect(
        await getMessageDataFromPath({
          fs,
          path: '/alice/charlie/plans/charlie/omgyes/message-1590595620.md',
        })
      ).toMatchSnapshot();
    });

    it('Throws on empty file', async () => {
      const fs = f.createDefaultMockFilesystem();

      await expect(
        getMessageDataFromPath({
          fs,
          path: '/elena/index.md',
        })
      ).rejects.toThrow();
    });
  });

  describe('writeMessageToPlanDirectory()', () => {
    it('Successfully writes the message file #lpWGL7', async () => {
      const fs = f.createDefaultMockFilesystem();
      const {
        markdown,
        data: { dateTimestampSeconds, sender },
      } = f.charlieMessage;

      await writeMessageToPlanDirectory({
        fs,
        planDirectoryPath: '/elena/',
        contentMarkdown: markdown,
        dateTimestampSeconds,
        sender,
      });

      const expectedFileContents = `${f.joinFrontmatter(f.charlieMessage)}\n`;

      expect(
        await fs.promises.readFile(
          `/elena/message-${dateTimestampSeconds}.md`,
          {
            encoding: 'utf8',
          }
        )
      ).toEqual(expectedFileContents);
    });

    it('Does not add a second trailing line break #JJBAfm', async () => {
      const fs = f.createDefaultMockFilesystem();
      const {
        markdown,
        data: { dateTimestampSeconds, sender },
      } = f.charlieMessage;

      await writeMessageToPlanDirectory({
        fs,
        planDirectoryPath: '/elena/',
        // Single trailing line break
        contentMarkdown: `${markdown}\n`,
        dateTimestampSeconds,
        sender,
      });

      const expectedFileContents = `${f.joinFrontmatter(f.charlieMessage)}\n`;

      expect(
        await fs.promises.readFile(
          `/elena/message-${dateTimestampSeconds}.md`,
          {
            encoding: 'utf8',
          }
        )
      ).toEqual(expectedFileContents);
    });

    it('Will add a third line break #JJBAfm', async () => {
      const fs = f.createDefaultMockFilesystem();
      const {
        markdown,
        data: { dateTimestampSeconds, sender },
      } = f.charlieMessage;

      await writeMessageToPlanDirectory({
        fs,
        planDirectoryPath: '/elena/',
        contentMarkdown: `${markdown}\n\n`,
        dateTimestampSeconds,
        sender,
      });

      const expectedFileContents = `${f.joinFrontmatter(f.charlieMessage)}\n\n`;

      expect(
        await fs.promises.readFile(
          `/elena/message-${dateTimestampSeconds}.md`,
          {
            encoding: 'utf8',
          }
        )
      ).toEqual(expectedFileContents);
    });
  });
});
