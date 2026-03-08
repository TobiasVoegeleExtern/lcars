import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGrid } from '../../components/form-grid/form-grid';
import { AppInput } from '../../components/input/input';

@Component({
  selector: 'app-media-db-form',
  standalone: true,
  imports: [CommonModule, FormGrid, AppInput],
  templateUrl: './media-db-form.component.html',
  styleUrls: ['./media-db-form.component.scss']
})
export class MediaDbFormComponent {
  // Inputs: Was soll bearbeitet werden?
  record = input.required<any>(); 
  isEditMode = input<boolean>(false);

  // Outputs: Aktionen zurück an die Hauptkomponente
  save = output<any>();
  cancel = output<void>();
  update = output<{field: string, value: string}>();

  onInputChange(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.update.emit({ field, value });
  }
}