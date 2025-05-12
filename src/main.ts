import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';

const maskConfig: Partial<NgxMaskConfig> = {
  validation: false,
};

registerLocaleData(localePt);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideAnimations(),
    provideEnvironmentNgxMask(maskConfig),
    ...appConfig.providers,
  ],
}).catch((err) => console.error(err));
