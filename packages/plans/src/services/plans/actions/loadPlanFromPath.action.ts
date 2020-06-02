import Bluebird from 'bluebird';
import { FS } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { to } from '../../../utils/to.util';
import {
  getPlanDataFromIndexFilePath,
  getPlanFilesFromDirectory,
  Plan,
} from '../plans.service';
import { noop, upsertOnePlan } from '../plans.state';
import { loadMessageFromPath } from './loadMessageFromPath.action';

export const loadPlanFromPath = ({
  fs,
  path,
  userId,
  slug,
}: {
  fs: FS;
  path: string;
  userId: string;
  slug: string;
}): AppThunk => async dispatch => {
  dispatch(
    noop({
      code: '#FWoxSS',
      message: 'Load plan from path',
      params: { userId, path, slug },
    })
  );

  const responseOne = await to(getPlanFilesFromDirectory({ fs, path }));

  if (responseOne.error) {
    const { error } = responseOne;
    dispatch(
      noop({
        code: '#VFlmTq',
        message: 'Error getting plan from directory',
        params: { error, slug, path },
      })
    );
    return;
  }

  const { result } = responseOne;
  const { indexFile, messageFiles } = result;

  const planId = indexFile.path;

  const responseTwo = await to(
    getPlanDataFromIndexFilePath({
      fs,
      path: indexFile.path,
    })
  );

  if (responseTwo.error) {
    const { error } = responseTwo;
    dispatch(
      noop({
        code: '#scgkS0',
        message: 'Error reading plan data.',
        params: { indexFile, error },
      })
    );
    return;
  }

  const { content, data } = responseTwo.result;

  const plan: Plan = {
    id: planId,
    userId,
    ...data,
    descriptionMarkdown: content,
    slug,
  };

  await dispatch(upsertOnePlan(plan));

  await Bluebird.each(messageFiles, async messageFile => {
    const { slug, path } = messageFile;
    await dispatch(
      loadMessageFromPath({
        fs,
        path,
        slug,
        planId,
      })
    );
  });

  dispatch(
    noop({
      code: '#iXomhQ',
      message: 'loadPlanFromPath() finishd',
      params: { userId, path, slug },
    })
  );
};
