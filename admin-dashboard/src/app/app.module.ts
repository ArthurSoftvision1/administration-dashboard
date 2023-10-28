import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesTableComponent } from './employees-table/employees-table.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatIconModule } from '@angular/material/icon';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { employeeReducer } from './store/employee.reducer';
import { EmployeeEffects } from './store/employee.effects';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EmployeesTableComponent,
    EditModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    StoreModule.forRoot({ employees: employeeReducer }),
    EffectsModule.forRoot([EmployeeEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
