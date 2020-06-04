import { relative } from 'path';
import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { timestampSeconds } from '../../../utils/time.utils';
import { to } from '../../../utils/to.util';
import { ensureRepoIsCurrent } from '../../repos/actions/ensureRepoIsCurrent.action';
import { selectById } from '../../repos/repos.state';
import { getMyUsernameOrThrow } from '../../startup/startup.state';
import { noop, selectFolderById, selectPlanById } from '../plans.state';
import { writeMessageToPlanDirectory } from '../services/messages/messages.service';
import { loadPlanFromPath } from './loadPlanFromPath.action';
import { saveAndPush } from '../../repos/actions/saveAndPush.action';

export const saveNewMessage = ({
  fs,
  http,
  headers,
  planId,
  contentMarkdown,
}: GitParams & {
  planId: string;
  contentMarkdown: string;
}): AppThunk => async (dispatch, getRootState) => {
  const dateTimestampSeconds = timestampSeconds();

  const rootState = getRootState();

  const myUsername = getMyUsernameOrThrow(rootState);

  const plan = selectPlanById(rootState, planId);

  if (typeof plan === 'undefined') {
    // TODO Log error here
    throw new Error('Cannot find plan. #4VqrMR');
  }

  const folder = selectFolderById(rootState, plan.planFolderId);

  if (typeof folder === 'undefined') {
    // TODO Log error here
    throw new Error('Cannot find plan folder. #e0e7YJ');
  }

  const repo = selectById(rootState, folder.repoId);

  if (typeof repo === 'undefined') {
    // TODO Log error here
    throw new Error('Cannot find repo. #LtEtDp');
  }

  await dispatch(
    ensureRepoIsCurrent({
      fs,
      http,
      headers,
      dir: repo.path,
      id: repo.id,
      remote: repo.remote,
    })
  );

  const response = await to(
    writeMessageToPlanDirectory({
      fs,
      planDirectoryPath: plan.path,
      contentMarkdown,
      dateTimestampSeconds,
      sender: myUsername,
    })
  );

  if (response.error) {
    const { error } = response;
    noop({
      code: '#wRGmqb',
      message: 'Error writing message',
      params: {
        error,
        plan,
        contentMarkdown,
        dateTimestampSeconds,
        myUsername,
      },
    });
    throw error;
  }

  const newFileAbsolutePath = response.result;
  const newFilePath = relative(repo.path, newFileAbsolutePath);

  await dispatch(
    saveAndPush({
      fs,
      http,
      headers,
      repoId: repo.id,
      newFilePath,
      commitMessage: 'A new commit',
    })
  );

  await dispatch(
    loadPlanFromPath({
      fs,
      path: plan.path,
      planFolderId: plan.planFolderId,
      slug: plan.slug,
    })
  );
};
