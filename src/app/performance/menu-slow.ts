import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { DISHES, Dish, priceWithTax } from './sales';

// The slow version: a function call in the template.
// Angular calls it again for every row, on EVERY check of this component.
@Component({
  selector: 'app-menu-slow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button (click)="like()">Like ({{ likes }})</button>
    <p class="muted">priceWithTax() calls: <b #stats>0</b></p>
    <div class="table-scroll">
      <table>
        <tr><th>Dish</th><th>Price</th><th>With tax</th></tr>
        @for (dish of dishes; track dish.id) {
          <tr><td>{{ dish.name }}</td><td>{{ dish.price }}</td><td>{{ priceWithTax(dish) }}</td></tr>
        }
      </table>
    </div>
  `,
})
export class MenuSlow implements AfterViewChecked {
  dishes = DISHES;
  likes = 0;
  private calls = 0;
  private clickedAt = 0;
  private lastClickMs = 0;
  private stats = viewChild.required<ElementRef<HTMLElement>>('stats');

  priceWithTax(dish: Dish) {
    this.calls++;
    return priceWithTax(dish);
  }

  like() {
    this.clickedAt = performance.now();
    this.likes++;
  }

  // Written straight to the DOM, so showing the numbers does not cause another check.
  ngAfterViewChecked() {
    if (this.clickedAt) {
      this.lastClickMs = Math.round(performance.now() - this.clickedAt);
      this.clickedAt = 0;
    }
    this.stats().nativeElement.textContent = `${this.calls} (last Like click: ${this.lastClickMs} ms)`;
  }
}
