import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTamplateData } from '../interface/modal-interface';

import { ModalTemplateComponent } from 'src/app/sales/components/modal-template/modal-template.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public matDialog = inject(MatDialog);

  public openDialogTemplate(data: DialogTamplateData) {
    return this.matDialog.open(ModalTemplateComponent, { data });
  }
}
