// This is moved out of `store.ts` so as to avoid a circular dependency.
// However, this is something of a hack. It means that we cannot set this value
// while bootstrapping this package. Perhaps there's a more elegant way of
// achieving this...
export const REDUX_ROOT_KEY = '__plans' as const;
