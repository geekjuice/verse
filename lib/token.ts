import { cyan } from 'chalk';
import { prompt } from 'inquirer';
import { getPassword, setPassword, findPassword, deletePassword } from 'keytar';

const { env: { GENIUS_CLIENT_ACCESS_TOKEN } } = process;

const service = 'Genius API token';
const account = 'verse-cli';

const question = {
  message: 'Please enter Genius API client token:',
  type: 'password',
  name: 'token',
  mask: '*'
};

export const clear = async (): Promise<void> => {
  await deletePassword(service, account);
  console.log(cyan('✔ Genius API access token cleared'));
};

export const get = async (): Promise<string> => {
  if (GENIUS_CLIENT_ACCESS_TOKEN) {
    return Promise.resolve(GENIUS_CLIENT_ACCESS_TOKEN);
  }

  const cached = await findPassword(service);

  return cached
    ? getPassword(service, account)
    : prompt(question).then(async ({ token }): Promise<string> => {
        await setPassword(service, account, token);
        return token;
      });
};
