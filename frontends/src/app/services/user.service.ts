import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from './../models/User';
import {environment} from './../../environments/environment';
const BACKEND_API_URL = environment.apiURL + '/users';
@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post<any>(BACKEND_API_URL + '/login', { email: email, password: password });
    }

    getUser(email: string) {
        return this.http.get<any>(BACKEND_API_URL + '/' + email);
    }

    register(user: User) {
        return this.http.post<any>(BACKEND_API_URL + '/signup', user);
    }
}
