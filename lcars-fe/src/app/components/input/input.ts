import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss'
})
export class AppInput { 
  
  /** Das neue Label für das Input-Feld */
  @Input() label?: string;

  /** The value of the input field (bidirectional) */
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  /** The displayed placeholder text */
  @Input() placeholder: string = 'Text eingeben...';

  /** Optional type (text, password, number etc.) */
  @Input() type: string = 'text';

  /** State for focus indication */
  isFocused = signal(false);

  /**
   * Called on every change of the input value.
   * @param newValue The new value
   */
  onInputChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}