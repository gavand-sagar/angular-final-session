import { Component, Input } from '@angular/core';

// The "without" card: everything comes in as text through @Input.
@Component({
  selector: 'app-card-text',
  template: `
    <div class="box">
      <h3>{{ title }}</h3>
      <p>{{ body }}</p>
      <hr />
      <p>{{ footer }}</p>
    </div>
  `,
})
export class CardText {
  @Input() title = '';
  @Input() body = '';
  @Input() footer = '';
}
