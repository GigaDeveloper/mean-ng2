import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import { tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(
    private http: Http
  ) { }

  registerUser(user) {
    let url = 'http://localhost:3040/users/register';
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(url, user, options)
      .map(res => res.json());
  }

  authenticateUser(user) {
    let url = 'http://localhost:3040/users/authenticate';
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(url, user, options)
      .map(res => res.json());
  }

  getProfile() {
    let url = 'http://localhost:3040/users/profile';
    this.loadToken();
    let headers = new Headers({'Authorization': this.authToken, 'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.get(url, options)
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
