/* @flow */

class Config {
  _transformName(name: string): string {
    return name.toUpperCase();
  }

  has(name: string): boolean {
    return process.env.hasOwnProperty(this._transformName(name));
  }

  get(name: string, defaultValue?: string): string {
    const realName = this._transformName(name);
    let value = process.env[realName];
    if (value == null && defaultValue !== undefined) {
      value = defaultValue;
    }
    if (value == null) {
      throw new Error(`missing env var ${realName}`);
    }
    return value;
  }

  getBool(name: string, defaultValue?: boolean = false) {
    return this.has(name)
      ? this.get(name).toLowerCase() === 'true'
      : defaultValue;
  }
}

const instance = new Config();
export default instance;
