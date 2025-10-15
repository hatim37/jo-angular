import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatDivider} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton, MatButtonModule, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import { DashboardComponent } from './composants/dashboard/dashboard.component';
import { AddProductComponent } from './composants/add-product/add-product.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import { UpdateProductComponent } from './composants/update-product/update-product.component';
import { AccountComponent } from './composants/account/account.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatOption, MatSelect} from '@angular/material/select';
import { AllOrdersComponent } from './composants/all-orders/all-orders.component';
import { AnalyticsComponent } from './composants/analytics/analytics.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    AddProductComponent,
    UpdateProductComponent,
    AccountComponent,
    AllOrdersComponent,
    AnalyticsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatDivider,
    FormsModule,
    MatButtonModule,
    CommonModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatDivider,
    MatIcon,
    MatInput,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatSortHeader,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatButton,
    MatPaginator,
    MatIconButton,
    MatMiniFabButton,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    FormsModule,
    MatCheckbox,
    MatProgressSpinner,
  ]
})
export class AdminModule { }
