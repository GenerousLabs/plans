import { FS, Plan } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { writePlanToDisk } from '../plans.service';
import { selectFolderByIdOrThrow } from '../plans.state';
import { loadPlansFromFolder } from './loadPlansFromFolder.action';

export const saveNewPlan = ({
  fs,
  folderId,
  plan,
}: {
  fs: FS;
  folderId: string;
  plan: Pick<Plan, 'descriptionMarkdown' | 'name' | 'slug'>;
}): AppThunk => async (dispatch, getRootState) => {
  const rootState = getRootState();
  const folder = selectFolderByIdOrThrow(rootState, folderId);
  await writePlanToDisk({ fs, folderPath: folder.path, plan });
  await dispatch(
    loadPlansFromFolder({ fs, path: folder.path, folderId: folder.id })
  );
};
