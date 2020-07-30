import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import {
  getReposFromReposYaml,
  rootPathToReposYamlPath,
  yamlRepoToReduxRepo,
} from '../me.service';
import { addManyRepos } from '../me.state';

export const loadRepos = ({
  fs,
  rootPath,
}: Pick<GitParams, 'fs'> & {
  rootPath: string;
}): AppThunk => async dispatch => {
  const yamlPath = rootPathToReposYamlPath(rootPath);

  const yamlRepos = await getReposFromReposYaml({ fs, path: yamlPath });

  const repos = yamlRepos.map(repo => yamlRepoToReduxRepo({ rootPath, repo }));

  await dispatch(addManyRepos(repos));

  return repos;
};
