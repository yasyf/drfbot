/* @flow */


import type { Company, Pattern } from './types';

import Cache from './cache';
import config from './config';
import request from 'request';
const Immutable = require('immutable');

const COMPANIES_KEY = 'companies';

export class API {
  static domain = config.get('API_DOMAIN', 'vote.drf.vc');
  static apiVersion = 1;
  cache: Cache<Array<Company>>;

  constructor() {
    this.cache = new Cache();
  }

  static url(path: string): string {
    return `http://${this.domain}/${path}`;
  }

  static path(method: string): string {
    return this.url(`api/v${this.apiVersion}/${method}/`);
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

  getCompanies(): Promise<Immutable.List<Company>> {
    return this.cache.getOrGenerate(COMPANIES_KEY, () =>
      this.get('companies').then(result => result.companies)
    ).then(Immutable.List);
  }

  getCompanyPatterns(): Promise<Immutable.List<Pattern>> {
    return this.getCompanies().then(companies =>
      companies.map(company => company.name)
    );
  }

  getCompany(name: string): Promise<Company> {
    const keyName = name.toLowerCase();
    return this.getCompanies().then(companies => {
      const company = companies.find(co => co.name.toLowerCase() === keyName);
      if (!company) {
        throw new Error(`${name} not found!`);
      }
      return company;
    });
  }

  searchCompanies(query: string): Promise<Immutable.List<Company>> {
    return this.getCompany(query)
      .then(Immutable.List.of)
      .catch(_ =>
        this.get('companies/search', {
          q: query,
        }).then(body => Immutable.List(body.results))
      );
  }
}

const instance = new API();
export default instance;
