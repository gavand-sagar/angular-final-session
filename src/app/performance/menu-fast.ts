import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { DISHES, priceWithTax } from './sales';

// The fixed version: the price is calculated once, and the template only reads a value.
@Component({
  selector: 'app-menu-fast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button (click)="like()">Like ({{ likes }})</button>
    <p class="muted">priceWithTax() calls: <b #stats>0</b></p>
    <div class="table-scroll">
      <table>
        <tr><th>Dish</th><th>Price</th><th>With tax</th></tr>
        @for (row of rows; track row.id) {
          <tr><td>{{ row.name }}</td><td>{{ row.price }}</td><td>{{ row.withTax }}</td></tr>
        }
      </table>
    </div>
  `,
})
export class MenuFast implements AfterViewChecked {
  private calls = 0;

  // Done once, when the component is created
  rows = DISHES.map((dish) => {
    this.calls++;
    return { ...dish, withTax: priceWithTax(dish) };
  });
  likes = 0;
  private clickedAt = 0;
  private lastClickMs = 0;
  private stats = viewChild.required<ElementRef<HTMLElement>>('stats');

  like() {
    this.clickedAt = performance.now();
    this.likes++;
  }

  ngAfterViewChecked() {
    if (this.clickedAt) {
      this.lastClickMs = Math.round(performance.now() - this.clickedAt);
      this.clickedAt = 0;
    }
    this.stats().nativeElement.textContent = `${this.calls} (last Like click: ${this.lastClickMs} ms)`;
  }
}
