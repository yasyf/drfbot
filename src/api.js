/* @flow */


import * as Immutable from 'immutable';

import type { Company, Pattern, VotingStatus } from './types';

import Cache from './cache';
import config from './config';
import fetch from './fetch';

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
      ...options,
    };
    return fetch(API.path(path), allOptions);
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

  put(path: string, data?: Object): Promise<Object> {
    const options = {
      form: data,
    };
    return this._authenticatedRequest('PUT', path, options);
  }

  getEvent(eventID: string): Promise<void> {
    return this.get(`events/${eventID}`).then((body) => body.event);
  }

  addEventNotes(eventID: string, notes: string): Promise<void> {
    return this.put(`events/${eventID}`, { notes });
  }

  invalidateEvent(eventID: string): Promise<void> {
    return this.post(`events/${eventID}/invalidate`);
  }

  allocateCompany(companyID: number, userID: string): Promise<void> {
    return this.post(`companies/${companyID}/allocate`, {
      user_slack_id: userID,
    }).then((_body) => undefined);
  }

  rejectCompany(companyID: number): Promise<void> {
    return this
      .post(`companies/${companyID}/reject`)
      .then((_body) => undefined);
  }

  invalidateCompany(companyID: number): Promise<void> {
    return this
      .post(`companies/${companyID}/invalidate_crunchbase`)
      .then((_body) => undefined);
  }

  getCompanyByID(companyID: number): Promise<void> {
    return this.get(`companies/${companyID}`).then(body => body.company);
  }

  getVotingStatus(companyID: number): Promise<VotingStatus> {
    return this.get(`companies/${companyID}/voting_status`);
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
    return this.cache.getOrGenerate(`${COMPANIES_KEY}:${query}`, () =>
      this.getCompany(query)
        .then((company) => [company])
        .catch(_ =>
          this.get('companies/search', {
            q: query,
          }).then(body => body.results)
        )
    ).then(Immutable.List);
  }
}

const instance = new API();
export default instance;
