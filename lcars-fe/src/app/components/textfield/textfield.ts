import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textfield',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './textfield.html',
  styleUrl: './textfield.scss'
})
export class Textfield {
  @Input() label?: string;
  @Input() placeholder: string = 'Details eingeben...';
  @Input() value: string = '';
  @Input() rows: number = 4;
  @Input() readOnly: boolean = false;
  @Output() valueChange = new EventEmitter<string>();


  isFocused = signal(false);

 
  onInputChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}