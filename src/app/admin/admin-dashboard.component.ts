import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SideNavComponent } from './components/sidenav/sidenav.component';
import { NbCardModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NbCardModule,
    SideNavComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {}
