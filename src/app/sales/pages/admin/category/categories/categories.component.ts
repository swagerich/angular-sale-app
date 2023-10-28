import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CategoryService } from 'src/app/sales/services/category.service';
import { Subscription } from 'rxjs';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { CreateUpdateComponent } from '../create-update/create-update.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private categorieService = inject(CategoryService);

  private subscription$ = new Subscription();

  public categories: CategoryDto[] = [];

  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.subscription$ = this.categorieService
      .fetchAllCategory()
      .subscribe((response) => {
        this.categories = response;
      });
  }

  openDialogForm(): void {
    let dialogRef = this.dialog.open(CreateUpdateComponent);
    dialogRef.afterClosed().subscribe({
      next: () => {
        this.loadCategories();
      },
    });
  }
  openDialogEdit(data: CategoryDto): void {
    let dialogRef = this.dialog.open(CreateUpdateComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: () => {
        this.loadCategories();
      },
    });
  }
  deleteCategory(categoryId: number): void {
    const category =  this.categories.find(c => c.id === categoryId);
    if(category){
      Swal.fire({
        title: `¿Estas seguro de eliminar la categoria ${category.name} ?`,
        text: 'No podras revertir esta accion',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.subscription$ = this.categorieService
            .deleteCategory(categoryId)
            .subscribe({
              next: () => {
                this.loadCategories();
                Swal.fire('Eliminado!', 'La categoria ha sido eliminada', 'success');
              },
            });
         
        }
      });
    }
   
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
