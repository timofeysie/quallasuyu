import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { authRoutes, AuthModule } from '@myorg/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from '@myorg/auth';
import { LayoutModule } from '@myorg/layout';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'products' },
      { path: 'auth', children: authRoutes },
      {
        path: 'products',
        loadChildren: '@myorg/products#ProductsModule',
        canActivate: [AuthGuard]
      }
    ]),
    AuthModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
