// src/app/components/card/card.ts
import { Component, Input } from '@angular/core';

@Component({

  selector: 'app-card', 
  standalone: true, 
  templateUrl: './card.html', 
  styleUrls: ['./card.scss']
})
export class Card { 
  
  @Input() title: string = ' ';

  constructor() {} 

}
