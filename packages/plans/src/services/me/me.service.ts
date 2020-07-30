import yaml from 'js-yaml';
import { join } from 'path';
import { ME_REPO_FOLDER, REPOS_FILENAME } from '../../shared.constants';
import { GitParams, Repo } from '../../shared.types';
import { doesFileExist } from '../../utils/fs.utils';
import { isRepo } from '../repos/repos.service';

export const rootPathToMeRepoPath = (rootPath: string) =>
  join(rootPath, ME_REPO_FOLDER);

export const rootPathToReposYamlPath = (rootPath: string) =>
  join(rootPathToMeRepoPath(rootPath), REPOS_FILENAME);

export const getReposFromReposYaml = async ({
  fs,
  path,
}: Pick<GitParams, 'fs'> & { path: string }) => {
  // If there is no file, then we return an empty array, so the code runs before
  // any repos have been created.
  if (!(await doesFileExist({ fs, path }))) {
    return [];
  }

  const contents = await fs.promises.readFile(path, { encoding: 'utf8' });

  const data = yaml.safeLoad(contents);

  if (typeof data === 'undefined' || typeof data.length !== 'number') {
    throw new Error('Invalid connection YAML data. #Tnsl4V');
  }

  const repos = (data as any[]).reduce<Repo[]>((repos, repo) => {
    if (isRepo(repo)) {
      return repos.concat(repo);
    }

    // TODO: Figure out how to gracefully handle errors
    throw new Error('Invalid entry in repo file. #nimUr6');
  }, []);

  return repos;
};
