const { cyan } = require('chalk');
const keytar = require('keytar');
const inquirer = require('inquirer');

const { env: { GENIUS_CLIENT_ACCESS_TOKEN } } = process;

const service = 'Genius API token';
const account = 'verse-cli';

const question = {
  message: 'Please enter Genius API client token:',
  type: 'password',
  name: 'token',
  mask: true
};

module.exports.clear = async () => {
  await keytar.deletePassword(service, account);
  console.log(cyan('✔ Genius API access token cleared'));
};

module.exports.get = async () => {
  if (GENIUS_CLIENT_ACCESS_TOKEN) {
    return Promise.resolve(GENIUS_CLIENT_ACCESS_TOKEN);
  }

  const cached = await keytar.findPassword(service, account);

  return cached
    ? keytar.getPassword(service, account)
    : inquirer.prompt(question).then(async ({ token }) => {
        await keytar.setPassword(service, account, token);
        return token;
      });
};
