import { FS } from '../shared.types';

export const doesDirectoryExist = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const stat = await fs.promises.stat(path);
  return stat.isDirectory();
};

export const doesFileExist = async ({ fs, path }: { fs: FS; path: string }) => {
  const stat = await fs.promises.stat(path);
  return stat.isFile();
};
