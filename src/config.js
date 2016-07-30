/* @flow */

class Config {
  get(name: string): string {
    const realName = name.toUpperCase();
    const value = process.env[realName];
    if (value == null) {
      throw new Error(`missing env var ${realName}`);
    }
    return value;
  }
}

const instance = new Config();
export default instance;
