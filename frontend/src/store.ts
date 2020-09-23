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
import { getMeRepoRemote } from "./services/key/key.service";

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
