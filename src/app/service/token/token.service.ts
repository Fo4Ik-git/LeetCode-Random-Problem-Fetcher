import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
  }

  private _session !: string;

  get session(): string {
    return localStorage.getItem('session') || this._session;
  }

  set session(value: string) {
    localStorage.setItem('session', value);
    this._session = value;
  }

  private _csrftoken !: string;

  get csrftoken(): string {
    return localStorage.getItem('csrftoken') || this._csrftoken;
  }

  set csrftoken(value: string) {
    localStorage.setItem('csrftoken', value);
    this._csrftoken = value;
  }
}
