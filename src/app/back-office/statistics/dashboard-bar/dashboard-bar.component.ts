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
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard-bar',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './dashboard-bar.component.html',
  styleUrl: './dashboard-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBarComponent implements OnChanges {
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
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );
    const surfaceBorder = documentStyle.getPropertyValue(
      '--p-content-border-color'
    );

    this.data = {
      labels: this.labels,
      datasets: this.datasets,
    };

    this.options = {
      plugins: {
        legend: { labels: { color: textColor } },
        title: { display: !!this.title, text: this.title },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
      },
    };

    this.cd.markForCheck();
  }
}
