import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogTamplateData } from 'src/app/utils/interface/modal-interface';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  styleUrls: ['./modal-template.component.css']
})
export class ModalTemplateComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:DialogTamplateData) { }
}
