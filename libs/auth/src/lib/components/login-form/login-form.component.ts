import { Component, EventEmitter, Output } from '@angular/core';
import { Authenticate } from '@myorg/data';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Output() submit = new EventEmitter<Authenticate>();

  login(authenticate: Authenticate) {
    console.log('authenticate',authenticate)
    this.submit.emit(authenticate);
  }
}
