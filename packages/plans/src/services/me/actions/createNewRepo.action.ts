import { createAsyncThunk } from '@reduxjs/toolkit';
import slugify from 'slugify';
import { GIT_AUTHOR_NAME, REPOS_FILENAME } from '../../../shared.constants';
import { GitParams, YamlRepo } from '../../../shared.types';
import { RootDispatch } from '../../../store';
import { commitAndPushFiles } from '../../git/git.service';
import {
  addRepoToReposYaml,
  rootPathToMeRepoPath,
  rootPathToReposYamlPath,
} from '../me.service';
import { loadRepos } from './loadRepos.action';

export const createNewRepo = createAsyncThunk(
  'PLANS/me/createNewRepo',
  async (
    {
      fs,
      http,
      headers,
      rootPath,
      repo,
    }: Omit<GitParams, 'dir'> & {
      rootPath: string;
      repo: Pick<YamlRepo, 'name' | 'remote'>;
    },
    { dispatch }: { dispatch: RootDispatch }
  ) => {
    const slug = slugify(repo.name, { lower: true });
    const newRepo = { ...repo, id: slug, slug };

    const path = rootPathToReposYamlPath(rootPath);
    const dir = rootPathToMeRepoPath(rootPath);

    // try {
    await addRepoToReposYaml({ fs, path, newRepo });

    await commitAndPushFiles({
      fs,
      http,
      headers,
      dir,
      relativeFilePaths: [REPOS_FILENAME],
      message: 'Added repo',
      author: {
        name: GIT_AUTHOR_NAME,
      },
    });
    // } catch (error) {
    //   console.error('Error in createNewRepo() action #FBzL8a', error);
    //   throw error;
    // }

    await dispatch(loadRepos({ fs, rootPath }));
  }
);
