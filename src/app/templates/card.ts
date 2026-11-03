import { Component, ElementRef, contentChild, input } from '@angular/core';

// The "with" card: 3 slots. The page decides what goes in each slot.
@Component({
  selector: 'app-card',
  template: `
    <div class="box">
      <h3><ng-content select="[card-title]" /></h3>
      <ng-content />
      <hr />
      @if (footer()) {
        <ng-content select="[card-footer]" />
      } @else {
        <p class="muted">(no footer given)</p>
      }
    </div>
  `,
})
export class Card {
  // contentChild looks inside what the PARENT put between <app-card> and </app-card>
  footer = contentChild<ElementRef>('footer');
}
