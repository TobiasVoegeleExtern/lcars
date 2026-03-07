import { Component } from '@angular/core';
import { FrameComponent } from './components/frame/frame'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FrameComponent], 
  template: `<app-frame></app-frame>`
})
export class App {}