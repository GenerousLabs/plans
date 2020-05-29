import { promises as fs } from 'fs';
import { join } from 'path';
import { loadPlansFromUserPath } from './services/plans/plans.actions';
import { init as initStorage } from './services/storage/storage.service';
import { AppThunk, createStore } from './store';

export { reducer } from './store';

export const start = ({
  rootPath,
}: {
  rootPath: string;
}): AppThunk => async dispatch => {
  dispatch(initStorage());
  dispatch(
    loadPlansFromUserPath({
      fs,
      userDirectoryPath: join(rootPath, 'bob'),
      userId: 'bob',
    })
  );
};

export const startWithPackageStore = ({ rootPath }: { rootPath: string }) => {
  const store = createStore();
  store.dispatch(start({ rootPath }));
};

if (process.env.NODE_ENV === 'development') {
  if (typeof process.env.ROOT_PATH === 'string') {
    const { ROOT_PATH } = process.env;
    console.log('Starting with ROOT_PATH #2Yc8PN', ROOT_PATH);
    startWithPackageStore({ rootPath: ROOT_PATH });
  }
}
