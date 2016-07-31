/* @flow */

import config from './config';
import request from 'request';

class API {
  static domain = 'vote.drf.vc';
  static apiVersion = 1;

  static path(method: string): string {
    return `http://${this.domain}/api/v${this.apiVersion}/${method}/`;
  }

  _authenticatedRequest(
    method: string,
    path: string,
    options: Object
  ): Promise<Object> {
    const allOptions = {
      auth: {
        bearer: config.get('API_TOKEN'),
      },
      method,
      url: API.path(path),
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

  get(path: string, qs?: Object): Promise<Object> {
    const options = {
      qs,
    };
    return this._authenticatedRequest('GET', path, options);
  }

  post(path: string, data?: Object): Promise<Object> {
    const options = {
      form: data,
    };
    return this._authenticatedRequest('POST', path, options);
  }

  allocateCompany(companyID: number, userID: string): Promise<void> {
    return this.post(`companies/${companyID}/allocate`, {
      user_trello_id: userID,
    }).then((_body) => undefined);
  }

  searchCompanies(query: string): Promise<Array<Object>> {
    return this.get('companies/search', {
      q: query,
    }).then(body => body.results);
  }
}

const instance = new API();
export default instance;
