import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { getReposFromReposYaml, rootPathToReposYamlPath } from '../me.service';
import { addManyRepos } from '../me.state';

export const loadRepos = ({
  fs,
  rootPath,
}: Pick<GitParams, 'fs'> & {
  rootPath: string;
}): AppThunk => async dispatch => {
  const yamlPath = rootPathToReposYamlPath(rootPath);

  const repos = await getReposFromReposYaml({ fs, path: yamlPath });

  await dispatch(addManyRepos(repos));

  return repos;
};
