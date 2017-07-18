/*  */


const debug = require('debug');
const { cyan } = require('chalk');
const { prompt } = require('inquirer');
const {
  getPassword,
  setPassword,
  findPassword,
  deletePassword
} = require('keytar');

const DEBUG = debug('verse:auth');

const { env: { GENIUS_CLIENT_ACCESS_TOKEN } } = process;

const SERVICE = 'Genius API token';
const ACCOUNT = 'verse-cli';

const question = {
  message: 'Please enter Genius API client token:',
  type: 'password',
  name: 'token',
  mask: '*'
};

module.exports.clearAuthToken = async () => {
  DEBUG('clearing client token from keychain');
  await deletePassword(SERVICE, ACCOUNT);
  console.log(cyan('✔ Genius API access token cleared'));
};

module.exports.getAuthToken = async () => {
  DEBUG('getting client token from keychain');
  if (GENIUS_CLIENT_ACCESS_TOKEN) {
    return Promise.resolve(GENIUS_CLIENT_ACCESS_TOKEN);
  }

  DEBUG('finding client token from keychain');
  const cached = await findPassword(SERVICE);
  if (cached) {
    return getPassword(SERVICE, ACCOUNT);
  }

  const { token } = await prompt(question);
  DEBUG('setting client token to keychain');
  await setPassword(SERVICE, ACCOUNT, token);
  return token;
};
