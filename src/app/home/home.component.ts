import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  cols: number = 4;

  constructor() {
    this.setCols();
  }

  @HostListener('window:resize')
  onResize() {
    this.setCols();
  }

  setCols() {
    const w = window.innerWidth;
    if (w < 600) {
      this.cols = 1;
    } else if (w < 960) {
      this.cols = 2;
    } else {
      this.cols = 4;
    }
  }
}
