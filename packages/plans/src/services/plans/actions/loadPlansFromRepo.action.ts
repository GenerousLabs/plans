import Bluebird from 'bluebird';
import { FS, Repo } from '../../../shared.types';
import { AppThunk } from '../../../store';
import {
  addPlansFolderToPath,
  getChildDirectoriesFromPath,
} from '../plans.service';
import { addOneUser, noop } from '../plans.state';
import { loadPlansFromFolder } from './loadPlansFromFolder.action';

export const loadPlansFromRepo = ({
  fs,
  repo,
}: {
  fs: FS;
  repo: Pick<Repo, 'id' | 'path'>;
}): AppThunk => async dispatch => {
  const { id: repoId, path } = repo;

  dispatch(
    noop({
      code: '#wi9aR7',
      message: 'loadPlansFromRepo called',
      params: { repoId, path },
    })
  );

  const plansPath = addPlansFolderToPath({ path });

  const userFolders = await getChildDirectoriesFromPath({
    fs,
    path: plansPath,
  });

  await Bluebird.each(userFolders, async userFolder => {
    const { slug, path } = userFolder;

    await dispatch(
      addOneUser({
        id: slug,
        name: 'Name Coming Soon',
        slug,
        description: 'Will be loaded soon',
        path,
      })
    );

    await dispatch(loadPlansFromFolder({ fs, path, userId: slug }));
  });

  dispatch(
    noop({
      code: '#i0W2Yp',
      message: 'loadUserPlansAction finished',
      params: {
        repoId,
        path,
        plansPath,
        userFolders,
      },
    })
  );
};
