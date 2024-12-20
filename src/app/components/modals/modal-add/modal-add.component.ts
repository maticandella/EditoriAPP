import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal-add.component.html'
})
export class ModalComponent {
  @Input() open = false; 
  @Input() message = '¿Está seguro de realizar esta acción?';
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';

  @Output() confirmAction = new EventEmitter<void>(); 
  @Output() cancelAction = new EventEmitter<void>(); 

  closeModal() {
    this.open = false;
    this.cancelAction.emit();
  }
}
