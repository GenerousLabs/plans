import Bluebird from 'bluebird';
import { FS } from '../../../shared.types';
import { AppThunk } from '../../../store';
import {
  getChildDirectoriesFromPath,
  addPlansFolderToPath,
} from '../plans.service';
import { noop, upsertOneFolder } from '../plans.state';
import { loadPlansFromFolder } from './loadPlansFromFolder.action';

export const loadPlansFromRepo = ({
  fs,
  repoId,
  path,
}: {
  fs: FS;
  repoId: string;
  path: string;
}): AppThunk => async dispatch => {
  dispatch(
    noop({
      code: '#wi9aR7',
      message: 'loadPlansFromRepo called',
      params: { repoId, path },
    })
  );

  const plansPath = addPlansFolderToPath({ path });

  const folders = await getChildDirectoriesFromPath({ fs, path: plansPath });

  await Bluebird.each(folders, async folder => {
    const folderId = folder.path;

    await dispatch(
      upsertOneFolder({
        id: folderId,
        repoId,
        folder: folder.slug,
        path: folder.path,
      })
    );

    await dispatch(loadPlansFromFolder({ fs, path: folder.path, folderId }));
  });

  dispatch(
    noop({
      code: '#i0W2Yp',
      message: 'loadUserPlansAction finished',
      params: {
        repoId,
        path,
        plansPath,
        folders,
      },
    })
  );
};
