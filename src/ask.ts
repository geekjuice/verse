import prompts from 'prompts';
import { Result } from './genius';

export const token = async (): Promise<string> => {
  const { answer } = await prompts({
    type: 'text',
    name: 'answer',
    message: 'please enter genius api client token',
  });

  if (answer == null) {
    process.exit(1);
  }

  return answer;
};

export const song = async (results: Result[]): Promise<Result> => {
  const { answer } = await prompts({
    type: 'select',
    name: 'answer',
    message: 'please select song',
    choices: results.map(({ title }, index) => ({
      title,
      value: String(index),
    })),
  });

  if (answer == null) {
    process.exit(1);
  }

  return results[Number(answer)];
};
