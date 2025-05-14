import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationsViewComponent } from './registrations-view/registrations-view.component';

export const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'registrations-view', component: RegistrationsViewComponent },
];
