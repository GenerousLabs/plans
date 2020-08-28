// We import this here to ensure that the development startup code is run
import './services/startup/startup.service';

import * as LightningFSImport from '@isomorphic-git/lightning-fs';
import httpWeb from 'isomorphic-git/http/web';

export const LightningFS = LightningFSImport;
export const http = httpWeb;

export { startup } from './services/startup/actions/startup.action';
export { reducer } from './store';
export { REDUX_ROOT_KEY } from './shared.constants';

export {
  selectAllUsers,
  selectUserById,
  selectUserByIdOrThrow,
  selectAllPlans,
  selectPlanById,
  selectPlanByIdOrThrow,
  selectPlanWithUserOrThrow,
  selectPlanWithUserAndRepoOrThrow,
} from './services/plans/plans.state';

export { createNewMyPlan } from './services/me/actions/createNewMyPlan.action';
export { createNewRepo } from './services/me/actions/createNewRepo.action';

export {
  selectAllRepos,
  selectRepoById,
  selectRepoByIdOrThrow,
  selectAllMyPlans,
  selectMyPlanById,
  selectMyPlanByIdOrThrow,
} from './services/me/me.state';

export { readConfigFromFile } from './services/config/config.service';
