/* @flow */

import { Set } from 'immutable';

import fs from 'fs';

// Names which collide with companies
const NAMES = [
  'alex',
];

class Dictionary {
  words: Set<string>;

  constructor() {
    const dict =
      fs.readFileSync(`${__dirname}/../words/en.txt`).toString('utf-8');
    this.words = Set(dict.split('\n')).union(Set(NAMES));
  }

  contains(word: string): boolean {
    return this.words.contains(word.toLowerCase());
  }

}

const instance = new Dictionary();
export default instance;
