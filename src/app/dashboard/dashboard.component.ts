import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getEmployeesData } from '../store/employee.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    // Dispatch the getEmployeesData action when the component is loaded
    this.store.dispatch(getEmployeesData());
  }
}
