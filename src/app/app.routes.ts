import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'registrations-overview',
        loadComponent: () =>
          import(
            './admin/components/registrations-overview/registrations-overview.component'
          ).then((m) => m.RegistrationsOverviewComponent),
      },
    ],
  },
];
