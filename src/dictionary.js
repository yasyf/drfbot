/* @flow */

import * as Immutable from 'immutable';

import fs from 'fs';

class Dictionary {
  words: Immutable.Set<string>;

  constructor() {
    const dict =
      fs.readFileSync(`${__dirname}/../words/en.txt`).toString('utf-8');
    this.words = Immutable.Set(dict.split('\n'));
  }

  contains(word: string): boolean {
    return this.words.contains(word.toLowerCase());
  }

}

const instance = new Dictionary();
export default instance;
