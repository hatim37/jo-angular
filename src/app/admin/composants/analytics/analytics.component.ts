import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {

  value:any;
  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.getAnalytics();
  }

  getAnalytics(): void {
    this.adminService.getAnalytics().subscribe({
      next: data => {
        this.value = data;
      }
    })
  }

}
