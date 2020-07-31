import { join } from 'path';
import slugify from 'slugify';
import { ME_REPO_ID } from '../../../shared.constants';
import { FS, Plan } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { loadPlansFromFolder } from '../../plans/actions/loadPlansFromFolder.action';
import { writePlanToDisk } from '../../plans/plans.service';
import { rootPathToMyPlansPath } from '../me.service';

export const createNewMyPlan = ({
  fs,
  plan,
  rootPath,
}: {
  fs: FS;
  rootPath: string;
  plan: Pick<Plan, 'description' | 'name'>;
}): AppThunk => async dispatch => {
  const slug = slugify(plan.name, { lower: true });
  const planWithSlug = { ...plan, slug };

  const myPlansPath = rootPathToMyPlansPath({ rootPath });
  const planFolderPath = join(myPlansPath, slug);

  // This is a very cheap, very dirty validation check. It would make sense to
  // greatly improve this.
  if (planWithSlug.name.length === 0 || planWithSlug.slug.length === 0) {
    throw new Error('Unknown error. #Q7dm0A');
  }

  await writePlanToDisk({ fs, folderPath: planFolderPath, plan: planWithSlug });
  await dispatch(
    loadPlansFromFolder({ fs, path: planFolderPath, userId: ME_REPO_ID })
  );
};
