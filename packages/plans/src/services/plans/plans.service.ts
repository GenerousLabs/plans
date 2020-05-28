import fsNode from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const PLANS_FOLDER_NAME = 'plans';

export type FS = {
  readdir: typeof fsNode.readdir;
  readFile: typeof fsNode.readFile;
  stat: typeof fsNode.stat;
};

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

// DEPRECATED
export const readPlansFromUserPlansDirectory = async ({
  fs,
  directoryPath,
}: {
  fs: FS;
  directoryPath: string;
}) => {
  const dir = await fs.readdir(directoryPath, { withFileTypes: true });
  const subDirectories = dir.filter(entry => entry.isDirectory());
  const plans = await Promise.all(
    subDirectories.map(async ({ name }) => {
      const subDirectoryPath = join(directoryPath, name);
      const planFiles = await fs.readdir(subDirectoryPath, {
        withFileTypes: true,
      });
      const index = planFiles.find(file => file.name === 'index.md');
      if (typeof index === 'undefined') {
        throw new Error(
          `#es01Hl Failed to find index.md for directory ${name}`
        );
      }
      const messageFiles = planFiles.filter(file => file.name !== 'index.md');
      const indexContent = await fs.readFile(
        join(subDirectoryPath, index.name),
        { encoding: 'utf-8' }
      );

      const messages = await Promise.all(
        messageFiles.map(async message => {
          return fs
            .readFile(join(subDirectoryPath, message.name), {
              encoding: 'utf-8',
            })
            .then(async markdown => {
              return {
                slug: message.name,
                ...(await parseMessageFromMarkdown(markdown)),
              };
            });
        })
      );

      const { content, data } = planMarkdownToData(indexContent);

      return {
        slug: name,
        descriptionMarkdown: content,
        ...data,
        messages,
      };
    })
  );

  return plans;
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
