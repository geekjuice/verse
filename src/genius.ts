import axios, { AxiosResponse } from 'axios';
import { load } from 'cheerio';
import { Exception } from './exception';

type Response = {
  response: {
    hits: Array<{
      type: string;
      result: {
        id: number;
        full_title: string;
        url: string;
      };
    }>;
  };
};

export type Result = {
  id: number;
  title: string;
  url: string;
};

const parse = ({
  data: {
    response: { hits },
  },
}: AxiosResponse<Response>): Result[] =>
  hits
    .filter(({ type }) => type === 'song')
    .map(({ result: { id, full_title: title, url } }) => ({ id, title, url }));

export const search = async (
  token: string,
  query: string
): Promise<Result[]> => {
  try {
    const response = await axios.get('https://api.genius.com/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query },
    });
    return parse(response);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw Exception(error, 'unauthorized: invalid genius token');
    }
    throw error;
  }
};

export const scrape = async (
  url: string,
  selector: string
): Promise<string> => {
  const { data } = await axios.get(url);
  const $ = load(data);
  return $(selector).text();
};
