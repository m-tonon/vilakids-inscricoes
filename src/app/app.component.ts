import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NbLayoutModule],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <h1>IPVO Acampa Kids</h1>
      </nb-layout-header>
      <nb-layout-column>
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'IPVO Vila Kids';
}
