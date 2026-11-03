import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { Card } from './card';
import { CardText } from './card-text';
import { MENU, MenuList } from './menu-list';

@Component({
  selector: 'app-templates-page',
  imports: [Card, CardText, MenuList],
  template: `
    <h1>1. viewChild, ng-content and ng-template</h1>
    <p class="hook">How do you build a component that the user of the component can fill and design?</p>

    <div class="box">
      <h2>Demo 1: The OTP box (viewChild)</h2>
      <div class="expect"><b>Expect:</b> after "Send OTP" the cursor should already be in the OTP box. Only one side does it.</div>
      <ol class="steps">
        <li>Red side: click <b>Send OTP</b>. Do not touch the mouse. Type <b>1234</b>.</li>
        <li>Green side: same thing.</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>Without viewChild</h3>
          <button (click)="sentWithout = true">Send OTP</button>
          @if (sentWithout) { <span class="muted">OTP sent to 98xxxxxx10</span> }
          <p><input placeholder="OTP" maxlength="4" /></p>
          <p class="muted">The class cannot reach the input, so the user has to click it.</p>
        </div>
        <div class="good">
          <h3>With viewChild</h3>
          <button (click)="sendOtp()">Send OTP</button>
          @if (sentWith) { <span class="muted">OTP sent to 98xxxxxx10</span> }
          <p><input #otpBox placeholder="OTP" maxlength="4" /></p>
          <p class="muted"><code>viewChild('otpBox')</code> gives the class the real input element.</p>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>viewChild</b> lets the class grab something from its <b>own</b> template: an element (focus, scroll, play a video) or a child component (call its method).</p>
        <p>It is ready in <b>ngAfterViewInit</b>, not in the constructor. The template does not exist yet in the constructor.</p>
        <p>Real examples: focus the first wrong field in a form, scroll a chat to the last message, pause a video.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 2: One card, many uses (ng-content)</h2>
      <div class="expect"><b>Expect:</b> both cards should show a real <b>Track order</b> button in the footer. One shows text instead.</div>
      <ol class="steps">
        <li>Look at the footer of the red card. Try to click the button.</li>
        <li>Look at the green cards. Click <b>Track order</b>. One green card has no footer at all.</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>&#64;Input strings</h3>
          <app-card-text title="Order #1042" body="2 pizzas, Rs 600" [footer]="footerHtml" />
          <p class="muted">An input is just text. The HTML is printed, not rendered.</p>
        </div>
        <div class="good">
          <h3>ng-content slots</h3>
          <app-card>
            <p>2 pizzas, Rs 600</p>
            <div card-footer #footer><button (click)="tracked = tracked + 1">Track order</button> @if (tracked) { <span class="muted">clicked {{ tracked }}</span> }</div>
            <span card-title>Order #1042</span>
          </app-card>
          <app-card>
            <span card-title>Profile</span>
            <p>Asha, Pune</p>
          </app-card>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>ng-content</b> puts the parent's HTML inside the child: buttons, images, other components. <code>select="[card-footer]"</code> makes named slots.</p>
        <p><b>contentChild</b> lets the card check what it was given. The second card noticed it has no footer.</p>
        <p>Real examples: card, modal, tab, accordion, page layout. Every UI library is built like this.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 3: Same list, your design (ng-template)</h2>
      <div class="expect"><b>Expect:</b> the manager wants price and a veg dot on each row. One list can do it without being changed.</div>
      <ol class="steps">
        <li>Look at the red list. How would you add the price? (Answer: edit <code>menu-list.ts</code> for every new design.)</li>
        <li>Green side: click <b>Simple</b>, <b>Menu card</b> and <b>Compact</b>. Same list component every time.</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>No template passed</h3>
          <app-menu-list [dishes]="menu" />
          <p class="muted">The list decides how a row looks.</p>
        </div>
        <div class="good">
          <h3>Template passed in</h3>
          <button [class.on]="design === 'simple'" (click)="design = 'simple'">Simple</button>
          <button [class.on]="design === 'card'" (click)="design = 'card'">Menu card</button>
          <button [class.on]="design === 'compact'" (click)="design = 'compact'">Compact</button>
          <app-menu-list [dishes]="menu" [rowTemplate]="compactRow"/>
          <p class="muted">The page decides how a row looks.</p>
        </div>
      </div>

      <ng-template #cardRow let-dish>
        <span [style.color]="dish.veg ? 'green' : 'red'">&#9679;</span> <b>{{ dish.name }}</b> <span class="tag">Rs {{ dish.price }}</span>
      </ng-template>
      <ng-template #compactRow let-dish>
        {{ dish.name }} . . . Rs {{ dish.price }}
      </ng-template>

      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>An <b>ng-template</b> is not shown by itself. It is a piece of HTML you can pass around and show later with <b>ngTemplateOutlet</b>.</p>
        <p><code>let-dish</code> receives the data the list sends in <code>context</code>.</p>
        <p><b>ng-container</b> is a wrapper that adds no element to the page.</p>
        <p>Real examples: a table where each page decides its cells, a dropdown with custom options.</p>
      </details>
    </div>
  `,
})
export default class TemplatesPage {
  // Demo 1
  sentWithout = false;
  sentWith = false;
  private otpBox = viewChild.required<ElementRef<HTMLInputElement>>('otpBox'); // document.getElementById()

  sendOtp() {
    this.sentWith = true;
    this.otpBox().nativeElement.focus();
  }

  // Demo 2
  footerHtml = '<button>Track order</button>';
  tracked = 0;

  // Demo 3
  menu = MENU;
  design: 'simple' | 'card' | 'compact' = 'simple';
}
