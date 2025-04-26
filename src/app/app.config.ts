import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { 
  NbThemeModule, 
  NbDatepickerModule, 
  NbDialogModule, 
  NbIconModule,
  NbStepperModule 
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'default' }),
      NbDatepickerModule.forRoot(),
      NbDialogModule.forRoot(),
      NbIconModule,
      NbEvaIconsModule,
      NbStepperModule
    )
  ]
};
