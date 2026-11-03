import { Component } from '@angular/core';
import { markDownloaded } from './downloads';
import { SALES } from './sales';

markDownloaded('chart-eager.ts');

// Imagine a big chart library (300 kB). Imported normally, so it comes with the page.
@Component({
  selector: 'app-chart-eager',
  template: `
    <div class="chart">
      @for (month of sales; track month.name) {
        <div class="bar-wrap"><div class="bar" [style.height.px]="month.sales"></div><span class="muted">{{ month.name }}</span></div>
      }
    </div>
  `,
})
export class ChartEager {
  sales = SALES;
}
