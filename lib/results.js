/*  */


const parse = ({ response: { hits } }) =>
  hits.map(({ result: { full_title: title, url } }) => ({ title, url }));

class Results {

  constructor(response) {
    this.results = parse(response);
  }

  get(index) {
    return this.results[index];
  }
}

module.exports = Results;
