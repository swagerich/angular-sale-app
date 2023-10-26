import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';

import { CategoryService } from 'src/app/sales/services/category.service';
import { Subscription } from 'rxjs';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { CreateUpdateComponent } from '../create-update/create-update.component';

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

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
