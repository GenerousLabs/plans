import { createAsyncThunk } from '@reduxjs/toolkit';
import { GitParams } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import {
  getReposFromReposYaml,
  rootPathToReposYamlPath,
  yamlRepoToReduxRepo,
} from '../me.service';
import { addManyRepos } from '../me.state';

export const loadRepos = createAsyncThunk<
  void,
  Pick<GitParams, 'fs'> & {
    rootPath: string;
  },
  RootThunkApi
>('PLANS/me/loadRepos', async ({ fs, rootPath }, { dispatch }) => {
  const yamlPath = rootPathToReposYamlPath(rootPath);

  const yamlRepos = await getReposFromReposYaml({ fs, path: yamlPath });

  const repos = yamlRepos.map(repo => yamlRepoToReduxRepo({ rootPath, repo }));

  await dispatch(addManyRepos(repos));
});
