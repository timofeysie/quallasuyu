import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UiModule } from '@myorg/ui';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { RestrictedComponent } from './restricted/restricted.component';
import { UnrestrictedComponent } from './unrestricted/unrestricted.component';
import { routes } from './app-routing.module';

describe('Router: App', () => {
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        UiModule,
        HttpClientModule
      ],
      declarations: [
        ContactListComponent,
        ContactDetailComponent,
        UnrestrictedComponent,
        RestrictedComponent,
        AppComponent]
    });
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
    fixture.ngZone.run(() => {
      router.initialNavigation();
    });
  });

  it('navigate to "" redirects you to /contacts', fakeAsync(() => {
    fixture.ngZone.run(() => {
      router.navigate(['']);
      tick();
      expect(location.path()).toBe('/contacts');
    });
  }));

  it('navigate to "contact" takes you to /contact', fakeAsync(() => {
    fixture.ngZone.run(() => {
      router.navigate(['/contact/2']);
      tick();
      expect(location.path()).toBe('/contact/2');
    });
  }));

  it('fakeAsync works', fakeAsync(() => {
    let promise = new Promise(resolve => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => (done = true));
    tick(50);
    expect(done).toBeTruthy();
  }));
});
