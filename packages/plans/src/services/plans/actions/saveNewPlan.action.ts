import { FS, Plan } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { writePlanToDisk } from '../plans.service';
import { selectUserByIdOrThrow } from '../plans.state';
import { loadPlansFromFolder } from './loadPlansFromFolder.action';

export const saveNewPlan = ({
  fs,
  userId,
  plan,
}: {
  fs: FS;
  userId: string;
  plan: Pick<Plan, 'description' | 'name' | 'slug'>;
}): AppThunk => async (dispatch, getRootState) => {
  const rootState = getRootState();
  const folder = selectUserByIdOrThrow(rootState, userId);
  await writePlanToDisk({ fs, folderPath: folder.path, plan });
  await dispatch(loadPlansFromFolder({ fs, path: folder.path, userId }));
};
