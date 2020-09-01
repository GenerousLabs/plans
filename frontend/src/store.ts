import {
  Action,
  configureStore,
  getDefaultMiddleware,
  Middleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import {
  http,
  LightningFS,
  reducer as plansReducer,
  REDUX_ROOT_KEY as plansKey,
  startup,
} from "plans";

const ME_REPO_REMOTE_KEY = "__meRepoRemote" as const;
const rootPath = "/p" as const;

// NOTE: Wipe the storage on startup in development. Makes things easier.
const wipe = process.env.NODE_ENV === "development";

export const fs = new LightningFS("domd", { wipe });

export const addPlanConfigs = <T>(input: T) => {
  return { ...input, fs: fs as any, http, rootPath };
};

const errorLogger: Middleware = (store) => (next) => (action) => {
  if (action.type.substr(-9) === "/rejected") {
    console.error("Rejected error #xBPArN", action);
  }
  return next(action);
};

const middlewares = process.env.NODE_ENV === "development" ? [errorLogger] : [];

export const store = configureStore({
  reducer: {
    [plansKey]: plansReducer,
  },
  middleware: getDefaultMiddleware().concat(middlewares),
});

const getMeRepoRemote = () => {
  const meRepoRemote =
    globalThis.localStorage.getItem(ME_REPO_REMOTE_KEY) || "";
  if (meRepoRemote.length > 0) {
    return meRepoRemote;
  }
  const remote =
    globalThis.prompt(`Please enter your activation code. #gkR3G9`) || "";
  if (remote.length === 0) {
    alert(`Sorry, something went wrong. #fKohL2`);
    throw new Error("Unknown error. #74jkOP");
  }
  const decoded = globalThis.atob(remote);
  globalThis.localStorage.setItem(ME_REPO_REMOTE_KEY, decoded);

  return decoded;
};

const start = async () => {
  try {
    // await fs.promises.mkdir("/p", { recursive: true });
    const meRepoRemote = getMeRepoRemote();

    store.dispatch(
      startup({
        fs,
        http,
        rootConfig: {
          meRepoRemote,
          path: rootPath,
        },
      })
    );
  } catch (error) {
    console.error("Error during plans startup #wCZVo0", error);
  }
};
start();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
