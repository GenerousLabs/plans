import Bluebird from 'bluebird';
import { AppThunk } from '../../store';
import { to } from '../../utils/to.util';
import {
  addPlansFolderToPath,
  doesDirectoryExist,
  FS,
  getMessageDataFromPath,
  getPlanDataFromIndexFilePath,
  getPlanFilesFromDirectory,
  getPlanPathsFromUserDirectory,
  Message,
  Plan,
} from './plans.service';
import { noop, upsertOneMessage, upsertOnePlan } from './plans.state';

export const loadMessageFromPath = ({
  fs,
  path,
  slug,
  planId,
}: {
  fs: FS;
  path: string;
  slug: string;
  planId: string;
}): AppThunk => async dispatch => {
  dispatch(
    noop({
      code: '#apqZYY',
      message: 'Load message from path',
      params: { planId, path, slug },
    })
  );

  const response = await to(getMessageDataFromPath({ fs, path }));

  if (response.error) {
    const { error } = response;
    dispatch(
      noop({
        code: '#BO31C7',
        message: 'Error reading message file.',
        params: { error, path, planId },
      })
    );
    return;
  }

  const data = response.result;

  const message: Message = { id: path, planId, ...data, slug };

  dispatch(upsertOneMessage(message));
};

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

  dispatch(upsertOnePlan(plan));

  await Bluebird.each(messageFiles, async messageFile => {
    const { slug, path } = messageFile;
    dispatch(
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

export const loadPlansFromUserPath = ({
  fs,
  userId,
  userDirectoryPath,
}: {
  fs: FS;
  userId: string;
  userDirectoryPath: string;
}): AppThunk => async dispatch => {
  dispatch(
    noop({
      code: '#wi9aR7',
      message: 'loadUserPlansAction called',
      params: { userName: userId, userDirectoryPath },
    })
  );

  const plansPath = addPlansFolderToPath({ path: userDirectoryPath });

  // If the user does not have a `plans` folder, there's nothing to do here.
  if (!(await doesDirectoryExist({ fs, path: plansPath }))) {
    dispatch(
      noop({
        code: '#nMlg40',
        message: 'loadUserPlansAction directory not found',
        params: { userId, userDirectoryPath },
      })
    );
    return;
  }

  const plansPaths = await getPlanPathsFromUserDirectory({
    fs,
    path: plansPath,
  });

  await Bluebird.each(plansPaths, async ({ path, slug }) => {
    dispatch(
      loadPlanFromPath({
        fs,
        path,
        slug,
        userId,
      })
    );
  });

  dispatch(
    noop({
      code: '#i0W2Yp',
      message: 'loadUserPlansAction finished',
      params: {
        userId,
        userDirectoryPath,
        plansPaths,
      },
    })
  );
};
