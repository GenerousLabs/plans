import matter from 'gray-matter';
import { join } from 'path';
import { FS } from '../../shared.types';

const PLANS_FOLDER_NAME = 'plans';

export type Message = {
  id: string;
  planId: string;
  slug: string;
  sender: string;
  contentMarkdown: string;
};

export type Plan = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  descriptionMarkdown: string;
};

type PlanFrontMatter = {
  name: string;
};

export const _castToData = (input: { [key: string]: any }): PlanFrontMatter => {
  const { name } = input;
  if (typeof name !== 'string') {
    throw new Error('Failed to find name for plan. #6utWPT');
  }
  return { name };
};

export const planMarkdownToData = (markdownWithFrontmatter: string) => {
  const parsed = matter(markdownWithFrontmatter);
  const { content } = parsed;
  const data = _castToData(parsed.data);
  return { content, data };
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

export const addPlansFolderToPath = ({ path }: { path: string }): string => {
  return join(path, PLANS_FOLDER_NAME);
};

export const doesDirectoryExist = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const stat = await fs.stat(path);
  return stat.isDirectory();
};

export const getPlanPathsFromUserDirectory = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const dir = await fs.readdir(path, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  const plansPaths = dir
    .filter(plan => plan.isDirectory())
    .map(plan => ({ path: join(path, plan.name), slug: plan.name }));

  return plansPaths;
};

export const getPlanFilesFromDirectory = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const planFiles = await fs.readdir(path, {
    withFileTypes: true,
  });

  const index = planFiles.find(file => file.name === 'index.md');

  if (typeof index === 'undefined') {
    throw new Error(`Plan does not have index file. #yJtokv`);
  }

  const indexFile = { path: join(path, index.name), slug: index.name };

  const messageFiles = planFiles
    .filter(file => file.name !== 'index.md')
    .map(file => ({ path: join(path, file.name), slug: file.name }));

  return { indexFile, messageFiles };
};

export const getPlanDataFromIndexFilePath = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const text = await fs.readFile(path, { encoding: 'utf-8' });

  const planData = planMarkdownToData(text);

  return planData;
};

export const getMessageDataFromPath = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const markdown = await fs.readFile(path, {
    encoding: 'utf-8',
  });

  const data = await parseMessageFromMarkdown(markdown);

  return data;
};
