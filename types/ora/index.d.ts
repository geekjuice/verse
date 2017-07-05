// Type definitions for ora 1.3.0
// Project: https://github.com/sindresorhus/ora
// Definitions by: Nicholas Hwang <http://nicholash.wang>

export interface Instance {
  start(): Instance;
  stop(): Instance;
  fail(message: number): Instance;
  text: string;
}

export declare function ora(message: string): Instance
