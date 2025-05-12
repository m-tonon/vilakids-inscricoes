import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import {
  NbThemeModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbStepperModule,
  NbToastrModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'default' }),
      NbDatepickerModule.forRoot(),
      NbDialogModule.forRoot(),
      NbToastrModule.forRoot(),
      NbIconModule,
      NbEvaIconsModule,
      NbStepperModule,
    ),
    provideHttpClient(),
  ],
};
