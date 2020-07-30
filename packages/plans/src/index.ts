// We import this here to ensure that the development startup code is run
import './services/startup/startup.service';

import * as LightningFSImport from '@isomorphic-git/lightning-fs';
import httpWeb from 'isomorphic-git/http/web';

export const LightningFS = LightningFSImport;
export const http = httpWeb;

export { startup } from './services/startup/actions/startup.action';
export { reducer } from './store';
export { REDUX_ROOT_KEY } from './shared.constants';
