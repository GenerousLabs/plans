// We import this here to ensure that the development startup code is run
import './services/startup/startup.service';

export { startup } from './services/startup/actions/startup.action';
export { reducer } from './store';
export { REDUX_ROOT_KEY } from './shared.constants';
