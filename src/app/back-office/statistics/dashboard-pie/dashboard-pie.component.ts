/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard-pie',
  standalone: true,
  imports: [ChartModule, ReactiveFormsModule],
  templateUrl: './dashboard-pie.component.html',
  styleUrl: './dashboard-pie.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPieComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() datasets: any[] = [];
  @Input() title = '';

  data: any;
  options: any;

  private readonly cd = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labels'] || changes['datasets']) {
      this.updateChart();
    }
  }

  private updateChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    this.data = {
      labels: this.labels,
      datasets: this.datasets,
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
        title: {
          display: !!this.title,
          text: this.title,
        },
      },
    };

    this.cd.markForCheck();
  }
}
