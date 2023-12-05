import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutComponent } from '@atlas/layout';

@Component({
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  selector: 'atlas-insights-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
