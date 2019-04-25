import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { RestrictedComponent } from './restricted/restricted.component';
import { UnrestrictedComponent } from './unrestricted/unrestricted.component';
import { AuthGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contacts' },
  { path: 'contacts', component: ContactListComponent },
  { path: 'contact/:id', component: ContactDetailComponent },
  { path: 'unrestricted', component: UnrestrictedComponent },
  { path: 'restricted', component: RestrictedComponent, canActivate: [ AuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
