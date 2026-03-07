import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { extend } from 'angular-three';
import * as THREE from 'three';
import { provideNgtRenderer } from 'angular-three/dom';

extend(THREE);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideNgtRenderer()
  ]
};