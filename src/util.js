/* @flow */

const Util = {
  promisify(
    actionFn: (handleFn: (error: Object, result: Object) => void) => void,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const handleFn = (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };
      actionFn(handleFn);
    });
  },
  randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default Util;
