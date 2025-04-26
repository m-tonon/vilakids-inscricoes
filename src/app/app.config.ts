import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { NbThemeModule, NbDatepickerModule, NbDialogModule, NbIconModule } from '@nebular/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'default' }),
      NbDatepickerModule.forRoot(),
      NbDialogModule.forRoot(),
      NbIconModule
    )
  ]
};
