// This is moved out of `store.ts` so as to avoid a circular dependency.
// However, this is something of a hack. It means that we cannot set this value
// while bootstrapping this package. Perhaps there's a more elegant way of
// achieving this...
export const REDUX_ROOT_KEY = '__plans' as const;

export const ME_REPO_ID = 'me' as const;
export const ME_REPO_FOLDER = 'me' as const;
export const REPOS_FILENAME = 'repos.yaml' as const;

export const REPOS_FOLDER = 'repos' as const;

export const ME_MOCK_REMOTE = 'http://localhost:8174/me.git';

export const PLAN_INDEX_FILENAME = 'index.md';

export const GIT_AUTHOR_NAME = 'GeneroUS Plans';
export const PLANS_AUTHOR = {
  name: GIT_AUTHOR_NAME,
};
