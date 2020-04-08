import { Component, OnInit } from '@angular/core';
import { AuthService } from '@myorg/auth'
import { Observable } from 'rxjs';
import { User } from '@myorg/data';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  user$: Observable<User>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout();
  }
}
