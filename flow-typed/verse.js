/* @flow */

declare module 'verse' {
  declare type Result = {
    url: string,
    title: string
  };

  declare type Response = {
    meta: Object,
    response: {
      hits: Array<{
        type: 'song',
        result: {
          full_title: string,
          url: string
        }
      }>
    }
  }
}
