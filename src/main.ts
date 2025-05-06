import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';

const maskConfig: Partial<NgxMaskConfig> = {
  validation: false,
};

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideEnvironmentNgxMask(maskConfig),
    ...appConfig.providers,
  ],
}).catch((err) => console.error(err));
