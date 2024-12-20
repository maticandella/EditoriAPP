import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './modal-delete.component.html'
})
export class ModalDeleteComponent {
  @Input() open = false; 
  @Input() message = '¿Está seguro de realizar esta acción?';
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() showDeleteButton = true;
  @Input() isOperationSuccessful = false;
  @Output() confirmAction = new EventEmitter<void>(); 
  @Output() cancelAction = new EventEmitter<void>(); 

  closeModal() {
    this.open = false;
    this.cancelAction.emit();
  }
}
