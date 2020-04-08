import { Injectable } from '@angular/core';
import { Authenticate, User } from '@myorg/data';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
​
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject$ = new BehaviorSubject<User>(null);
  user$ = this.userSubject$.asObservable();
​
  constructor(private httpClient: HttpClient) {
    const user = localStorage.getItem('user');
    if(user) {
      this.userSubject$.next(JSON.parse(user));
    }
  }

  logout() {
    localStorage.setItem('user', null);
    this.userSubject$ = new BehaviorSubject<User>(null);
    this.user$ = this.userSubject$.asObservable();
  }
​
  login(authenticate: Authenticate): Observable<User> {
    return this.httpClient.post<User>(
      'http://localhost:3000/login',
      authenticate
    ).pipe(tap((user: User) => {
        this.userSubject$.next(user);
        localStorage.setItem('user', JSON.stringify(user));
    }));
  }
​
}