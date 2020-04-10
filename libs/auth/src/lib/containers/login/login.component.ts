import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';
import { Authenticate } from '@myorg/data';
import { AuthState } from './../../+state/auth.reducer';
import { Store } from '@ngrx/store';
import * as authActions from './../../+state/auth.actions';
​

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService,
    private store: Store<AuthState>) {}

  ngOnInit() {}

  login(authenticate: Authenticate): void {
    this.store.dispatch(new authActions.Login(authenticate));
  }

}
