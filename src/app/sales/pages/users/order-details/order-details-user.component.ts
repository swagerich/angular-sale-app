import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { OrderDetailService } from 'src/app/sales/services/order-detail.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDetailProjection } from 'src/app/sales/proyecction/orderDetailProjection-interface';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/sales/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details-user.component.html',
  styleUrls: ['./order-details-user.component.css'],
})
export class OrderDetailsUserComponent implements OnInit, OnDestroy {
  private orderDetailService = inject(OrderDetailService);

  private validatorService = inject(ValidatorService);

  private authService = inject(AuthService);

  private subscription$ = new Subscription();

  public userId: number = 0;

  public dataPaginacion = new MatTableDataSource<OrderDetailProjection>();

  public displayedColumns: string[] = [
    'fullName',
    'fullAddress',
    'contactNumber',
    'alternativeContactNumber',
    'orderStatus',
    'amount',
  ];
  public orderDetails: OrderDetailProjection[] = [];
  public pageIndex = 0;
  public pageSize = 5;
  public totalElements = 0;
  public totalPages = 0;

  async ngOnInit(): Promise<void> {
    this.userId = this.authService.getUser().userId;
    await this.checkoutExistsOrder()
  }

  async checkoutExistsOrder(): Promise<boolean> {
    try {
      const exists = await firstValueFrom(
        this.orderDetailService.checkoutOrderDetailByUser(this.userId)
      );
      if (exists) {
        let load = await firstValueFrom(
          this.orderDetailService.fetchOrderDetaiilByUser(
            this.userId,
            this.pageIndex,
            this.pageSize
          )
        );
        this.orderDetails = load.orders;
        this.totalElements = load.pages.totalElements;
        this.totalPages = load.pages.totalPages;
        this.dataPaginacion = new MatTableDataSource<OrderDetailProjection>(
          this.orderDetails
       
        );
        return true;
      }
      return false;
    } catch (e:HttpErrorResponse | any) {
      if(e instanceof HttpErrorResponse){
        this.validatorService.showSnackBarForError(e);
      }
      return false;
    }
  }

  onPageChange(event: PageEvent) {
    this.getPage(event.pageIndex, event.pageSize);
  }

  getPage(nroPagina: number, cantidadPorPagina: number): void {
    this.subscription$ = this.orderDetailService
      .fetchOrderDetaiilByUser(this.userId, nroPagina, cantidadPorPagina)
      .subscribe({
        next: (response) => {
          this.orderDetails = response.orders;
          this.dataPaginacion = new MatTableDataSource<OrderDetailProjection>(
            this.orderDetails
          );
        },
        error: (e: HttpErrorResponse) => {
          this.validatorService.showSnackBarForError(e);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
