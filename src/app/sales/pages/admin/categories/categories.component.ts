import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/utils/service/modal.service';
import { ModalTemplateComponent } from 'src/app/sales/components/modal-template/modal-template.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/sales/services/category.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { Subscription } from 'rxjs';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { CreateUpdateComponent } from '../category/create-update/create-update.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit, OnDestroy {

  private dialogRef!: MatDialogRef<ModalTemplateComponent>;

  private modalService = inject(ModalService);

  private categorieService = inject(CategoryService);

  private validatorService = inject(ValidatorService);

  private subscription$ = new Subscription();

  private fb = inject(FormBuilder);

  public categories: CategoryDto[] = [];

  private dialog = inject(MatDialog);

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  ngOnInit(): void {
     this.loadCategories();
  }

  get currentCategory(): CategoryDto {
    return this.myForm.value as CategoryDto;
  }

  openDialogTemplate(template: TemplateRef<any>): void {
    this.dialogRef = this.modalService.openDialogTemplate({
      template,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.myForm.reset();
    });
  }



  loadCategories(): void {
    this.subscription$ = this.categorieService
      .fetchAllCategory()
      .subscribe((response) => {
        this.categories = response;
      });
  }


  saveCategory(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log(this.myForm.value);
   
    this.categorieService.saveCategory(this.myForm.value).subscribe((result)=>{
      console.log(result);
      
    });
    this.myForm.reset();
    this.dialogRef.close();
  }



  openDialogEditForm() {
    const dialogRef = this.dialog.open(CreateUpdateComponent);

    dialogRef.afterClosed().subscribe({
      next: (result) => {
       if(result){
        this.loadCategories();
       }
      },
    })
  }
  openDialogEdit(data:any):void{
    this.dialog.open(CreateUpdateComponent,{
      data
    })
    }
  

  isValidateField(field: string): boolean | null {
    return this.validatorService.isValidField(this.myForm, field);
  }


  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
