import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UiModule } from '@myorg/ui';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { BackendService } from './backend.service';
import { AppRoutingModule } from './app-routing.module';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';

@NgModule({
  declarations: [AppComponent,
    ContactListComponent,
    ContactDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UiModule,
    AppRoutingModule,
    InMemoryWebApiModule.forRoot(BackendService)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
