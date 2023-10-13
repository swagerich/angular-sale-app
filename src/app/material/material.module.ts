import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table'  
import { MatChipsModule } from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [],
  exports: [
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
  ]
})
export class MaterialModule { }
