/* @flow */

import type { Response, Result } from 'verse';

const parse = ({ response: { hits } }: Response): Array<Result> =>
  hits.map(({ result: { full_title: title, url } }) => ({ title, url }));

class Results {
  results: Array<Result>;

  constructor(response: Response) {
    this.results = parse(response);
  }

  get(index: number): Result {
    return this.results[index];
  }
}

module.exports = Results;
