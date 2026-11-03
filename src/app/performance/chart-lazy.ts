import { Component } from '@angular/core';
import { markDownloaded } from './downloads';
import { SALES } from './sales';

markDownloaded('chart-lazy.ts');

// The same big chart. The page only uses it inside @defer, so it gets its own file.
@Component({
  selector: 'app-chart-lazy',
  template: `
    <div class="chart">
      @for (month of sales; track month.name) {
        <div class="bar-wrap"><div class="bar" [style.height.px]="month.sales"></div><span class="muted">{{ month.name }}</span></div>
      }
    </div>
  `,
})
export class ChartLazy {
  sales = SALES;
}
