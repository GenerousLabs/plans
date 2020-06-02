import { FS } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { to } from '../../../utils/to.util';
import { getMessageDataFromPath, Message } from '../plans.service';
import { noop, upsertOneMessage } from '../plans.state';

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

  await dispatch(upsertOneMessage(message));
};
