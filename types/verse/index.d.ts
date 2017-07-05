// Type definitions for verse 1.1.0
// Project: https://github.com/geekjuice/verse
// Definitions by: Nicholas Hwang <http://nicholash.wang>

export interface RequestMeta {
  url: string;
  headers: {
    [header: string]: string;
  };
  qs: {
    q: string;
  };
}
