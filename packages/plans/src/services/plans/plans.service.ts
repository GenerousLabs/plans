import fsNode from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

type FS = {
  readdir: typeof fsNode.readdir;
  readFile: typeof fsNode.readFile;
};

type FrontMatter = {
  name: string;
};

export const _castToData = (input: { [key: string]: any }): FrontMatter => {
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

export const readPlansFileContents = async ({
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
      const index = planFiles.find(file => file.name.endsWith('index.md'));
      if (typeof index === 'undefined') {
        throw new Error(
          `#es01Hl Failed to find index.md for directory ${name}`
        );
      }
      const messages = planFiles.filter(
        file => !file.name.endsWith('index.md')
      );
      const indexContent = await fs.readFile(
        join(subDirectoryPath, index.name),
        { encoding: 'utf-8' }
      );
      const messagesContent = await Promise.all(
        messages.map(async message => {
          return fs.readFile(join(subDirectoryPath, message.name), {
            encoding: 'utf-8',
          });
        })
      );

      const plan = planMarkdownToData(indexContent);

      return {
        slug: name,
        ...plan,
        messagesContent,
      };
    })
  );

  return plans;
};
