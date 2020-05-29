import { FS } from '../shared.types';

const NOT_FOUND_ERROR_CODE = 'ENOENT';

export const doesDirectoryExist = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  return fs.promises.stat(path).then(
    stat => {
      return stat.isDirectory();
    },
    error => {
      if (error.code === NOT_FOUND_ERROR_CODE) {
        return false;
      }
      throw error;
    }
  );
};

export const doesFileExist = async ({ fs, path }: { fs: FS; path: string }) => {
  return await fs.promises.stat(path).then(
    stat => {
      return stat.isFile();
    },
    error => {
      if (error.code === NOT_FOUND_ERROR_CODE) {
        return false;
      }
      throw error;
    }
  );
};
