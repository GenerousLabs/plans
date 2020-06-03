import matter from 'gray-matter';
import { FS } from '../../../../shared.types';

export type Message = {
  id: string;
  planId: string;
  slug: string;
  sender: string;
  contentMarkdown: string;
};

type MessageFrontmatter = {
  sender: string;
  dateTimestampSeconds: number;
};

const parseMessageDataFromFrontmatter = (input: {
  [key: string]: any;
}): MessageFrontmatter => {
  const { sender, dateTimestampSeconds } = input;
  if (typeof sender !== 'string') {
    throw new Error('Failed to find sender for message. #gtNSF1');
  }
  if (typeof dateTimestampSeconds !== 'number') {
    throw new Error('Failed to find dateTimestampSeconds for message. #qD6aB3');
  }
  return { sender, dateTimestampSeconds };
};

export const parseMessageFromMarkdown = async (input: string) => {
  const parsed = matter(input);
  const { content } = parsed;
  const data = parseMessageDataFromFrontmatter(parsed.data);
  return { contentMarkdown: content, ...data };
};

/**
 * Return the contents of a single message file.
 */
export const getMessageDataFromPath = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const markdown = await fs.promises.readFile(path, {
    encoding: 'utf8',
  });

  const data = await parseMessageFromMarkdown(markdown);

  return data;
};
