import yaml from 'js-yaml';
import { join } from 'path';
import {
  ME_REPO_FOLDER,
  REPOS_FILENAME,
  REPOS_FOLDER,
  MY_PLANS_FOLDER,
  PLANS_FOLDER,
} from '../../shared.constants';
import { GitParams, isYamlRepo, Repo, YamlRepo } from '../../shared.types';
import { doesFileExist } from '../../utils/fs.utils';

export const rootPathToMeRepoPath = (rootPath: string) =>
  join(rootPath, ME_REPO_FOLDER);

export const rootPathToMyPlansRepoPath = (rootPath: string) =>
  join(rootPath, MY_PLANS_FOLDER);

export const rootPathToMyPlansPath = ({ rootPath }: { rootPath: string }) => {
  // TODO Use the real username here
  const myPlansPath = join(rootPath, MY_PLANS_FOLDER, PLANS_FOLDER, 'alice');
  return myPlansPath;
};

export const rootPathToReposYamlPath = (rootPath: string) =>
  join(rootPathToMeRepoPath(rootPath), REPOS_FILENAME);

export const rootPathToRepoPath = ({
  rootPath,
  repo,
}: {
  rootPath: string;
  repo: Pick<Repo, 'slug'>;
}) => join(rootPath, REPOS_FOLDER, repo.slug);

export const yamlRepoToReduxRepo = ({
  rootPath,
  repo,
}: {
  rootPath: string;
  repo: YamlRepo;
}): Repo => {
  const path = rootPathToRepoPath({ rootPath, repo });
  return {
    ...repo,
    path,
    lastFetchTimestampSeconds: 0,
    currentHeadCommitHash: '',
  };
};

export const getReposFromReposYaml = async ({
  fs,
  path,
}: Pick<GitParams, 'fs'> & { path: string }): Promise<YamlRepo[]> => {
  // If there is no file, then we return an empty array, so the code runs before
  // any repos have been created.
  if (!(await doesFileExist({ fs, path }))) {
    return [];
  }

  const contents = await fs.promises.readFile(path, { encoding: 'utf8' });

  const data = yaml.safeLoad(contents);

  if (typeof data === 'undefined' || typeof (data as any).length !== 'number') {
    throw new Error('Invalid connection YAML data. #Tnsl4V');
  }

  const repos = (data as any[]).reduce<YamlRepo[]>((repos, repo) => {
    if (isYamlRepo(repo)) {
      return repos.concat(repo);
    }

    // TODO: Figure out how to gracefully handle errors
    throw new Error('Invalid entry in repo file. #nimUr6');
  }, []);

  return repos;
};

export const addRepoToReposYaml = async ({
  fs,
  path,
  newRepo,
}: Pick<GitParams, 'fs'> & {
  path: string;
  newRepo: YamlRepo;
}): Promise<boolean> => {
  const existingRepos = await getReposFromReposYaml({ fs, path });

  const repos = existingRepos.concat(newRepo);

  const updatedYamlString = yaml.safeDump(repos);

  await fs.promises.writeFile(path, updatedYamlString, { encoding: 'utf8' });

  return true;
};
