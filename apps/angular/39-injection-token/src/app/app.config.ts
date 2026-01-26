import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TimerToken } from './data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', pathMatch: 'full', redirectTo: 'video' },
      {
        path: 'video',
        loadComponent: () => import('./video.component'),
        providers: [{ provide: TimerToken, useValue: 1000 }],
      },
      {
        path: 'phone',
        loadComponent: () => import('./phone.component'),
        providers: [{ provide: TimerToken, useValue: 2000 }],
      },
    ]),
  ],
};
