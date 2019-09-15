try {
  require('dotenv').config();
} catch (error) {} // eslint-disable-line no-empty

const {
  env: { NODE_ENV, DEBUG, GENIUS_ACCESS_TOKEN },
} = process;

export { NODE_ENV, DEBUG, GENIUS_ACCESS_TOKEN };
