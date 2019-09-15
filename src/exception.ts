export const MESSAGE = Symbol('message');

export const Exception = (error: Error, message: string): Error => {
  error[MESSAGE] = message;
  return error;
};
