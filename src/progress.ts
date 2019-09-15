import ora, { Ora } from 'ora';
import { DEBUG } from './env';

type MockOra = {
  start: () => MockOra;
  stop: () => MockOra;
  fail: () => MockOra;
  text: '';
};

type Progress = Ora | MockOra;

const mock: MockOra = {
  start: () => mock,
  stop: () => mock,
  fail: () => mock,
  text: '',
};

export default (...args: string[]): Progress => (DEBUG ? mock : ora(...args));
