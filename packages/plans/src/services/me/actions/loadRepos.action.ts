import { createAsyncThunk } from '@reduxjs/toolkit';
import Bluebird from 'bluebird';
import { GitParams } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import { loadPlansFromRepo } from '../../plans/actions/loadPlansFromRepo.action';
import {
  getReposFromReposYaml,
  rootPathToReposYamlPath,
  yamlRepoToReduxRepo,
} from '../me.service';
import { addManyRepos } from '../me.state';
import { pullRepo } from './pullRepo.action';

export const loadRepos = createAsyncThunk<
  void,
  Omit<GitParams, 'dir'> & {
    rootPath: string;
  },
  RootThunkApi
>(
  'PLANS/me/loadRepos',
  async ({ fs, http, headers, rootPath }, { dispatch }) => {
    const yamlPath = rootPathToReposYamlPath(rootPath);

    const yamlRepos = await getReposFromReposYaml({ fs, path: yamlPath });

    const repos = yamlRepos.map((repo) =>
      yamlRepoToReduxRepo({ rootPath, repo })
    );

    await dispatch(addManyRepos(repos));

    await Bluebird.each(repos, async (repo) => {
      try {
        await dispatch(pullRepo({ fs, http, headers, repo }));
        await dispatch(loadPlansFromRepo({ fs, repo }));
      } catch (error) {
        console.error('Error pulling repo or loading plans #9zmpoA', error);
      }
    });
  }
);
