import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.dialog.html',
  styleUrl: './confirm.dialog.scss',
})
export class ConfirmDialogComponent {
  @Input() title = 'Bestätigung erforderlich';
  @Input() message = 'Sind Sie sicher, dass Sie diesen Vorgang fortsetzen möchten?';
  
  @Input() confirmLabel = 'CONFIRM';
  @Input() cancelLabel = 'CANCEL';
  
  @Input() type: 'danger' | 'primary' = 'danger';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() { this.confirm.emit(); }
  onCancel() { this.cancel.emit(); }
}