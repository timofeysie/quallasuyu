import { Component, OnInit } from '@angular/core';
import { AuthService } from '@myorg/auth'
import { Observable } from 'rxjs';
import { User } from '@myorg/data';
import { Store } from '@ngrx/store';
import * as authActions from '@myorg/auth';
import { AuthState } from '@myorg/auth';
import { productsQuery } from '@myorg/auth';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  user$: Observable<User>;

  constructor(private authService: AuthService,
    private store: Store<AuthState>) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout();
    this.user$ = this.authService.user$;
    // this.store.dispatch(new authActions.AuthService.Login({}));
    this.user$ = this.store.select(productsQuery.getUser);
  }

}
