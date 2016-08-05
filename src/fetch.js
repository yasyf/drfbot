/* @flow */

import request from 'request';

export default function fetch(url: string, options?: Object): Promise<Object> {
  const allOptions = {
    url,
    ...options,
  };
  return new Promise((resolve, reject) => {
    const callback = (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error || response.statusCode);
      } else {
        resolve(body ? JSON.parse(body) : {});
      }
    };
    request(allOptions, callback);
  });
}
