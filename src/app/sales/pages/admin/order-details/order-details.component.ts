import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { OrderDetailService } from 'src/app/sales/services/order-detail.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import {
  OrderDetailProjection,
  OrderStatus,
} from 'src/app/sales/proyecction/orderDetailProjection-interface';
import { OrderDetailPageOfUserDto } from 'src/app/sales/interfaces/orderDetailOfPage-interface';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  private orderDetailService = inject(OrderDetailService);

  public validatorService = inject(ValidatorService);

  public subscription$ = new Subscription();

  public orderStatus: OrderStatus[] = [];

  public dataPaginacion = new MatTableDataSource<OrderDetailProjection>();
  public displayedColumns: string[] = [
    'id',
    'productName',
    'userName',
    'fullAddress',
    'contactNumber',
    'orderStatus',
  ];
  public orderDetails: OrderDetailProjection[] = [];
  public pageIndex = 0;
  public pageSize = 5;
  public totalElements = 0;
  public totalPages = 0;

  ngOnInit(): void {
    this.loadOrderDetails();
    this.loadOrderStatus();
  }

  loadOrderDetails(): void {
    this.subscription$ = this.orderDetailService
      .fetchOrderDetail(this.pageIndex, this.pageSize)
      .subscribe({
        next: (e: OrderDetailPageOfUserDto) => {
          this.orderDetails = e.orders;
          this.totalElements = e.pages.totalElements;
          this.totalPages = e.pages.totalPages;
          this.dataPaginacion = new MatTableDataSource<OrderDetailProjection>(
            this.orderDetails
          );
        },
      });
  }

  loadOrderStatus(): void {
    this.subscription$ = this.orderDetailService.fetchOrderStatus().subscribe({
      next: (response) => {
        this.orderStatus = response.orderStatus;
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.getPage(event.pageIndex, event.pageSize);
  }

  getPage(nroPagina: number, cantidadPorPagina: number): void {
    this.subscription$ = this.orderDetailService
      .fetchOrderDetail(nroPagina, cantidadPorPagina)
      .subscribe({
        next: (response) => {
          this.orderDetails = response.orders;
          this.dataPaginacion = new MatTableDataSource<OrderDetailProjection>(
            this.orderDetails
          );
        },
      });
  }

  async changeStatus(orderId: number, event: any): Promise<void> {
    const orderStatus = event.target.value;
    let response = await Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro que desea cambiar el estado de la orden?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });
    try {
      if (response.isConfirmed) {
        await firstValueFrom(
          this.orderDetailService.changeOrderStatus(orderId, orderStatus)
        );
        Swal.fire(
          '¡Cambio de estado exitoso!',
          'El estado de la orden ha sido cambiado',
          'success'
        );
      }
    } catch (e: HttpErrorResponse | any) {
      this.validatorService.showSnackBarForError(e);
    } finally {
      this.loadOrderDetails();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
