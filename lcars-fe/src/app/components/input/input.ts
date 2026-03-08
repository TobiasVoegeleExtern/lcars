import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.html',
  styleUrls: ['./input.scss']
})
export class AppInput { 
  @Input() label?: string;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() placeholder: string = 'ENTER_DATA...';
  @Input() type: string = 'text';

  isFocused = signal(false);

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    // Ternary Event-Handling
    val !== undefined ? (this.value = val, this.valueChange.emit(val)) : null;
  }

  setFocus(state: boolean): void {
    // Ternary State-Toggle
    state ? this.isFocused.set(true) : this.isFocused.set(false);
  }
}