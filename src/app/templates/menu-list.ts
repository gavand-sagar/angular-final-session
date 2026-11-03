import { Component, TemplateRef, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface Dish {
  id: number;
  name: string;
  price: number;
  veg: boolean;
}

export const MENU: Dish[] = [
  { id: 1, name: 'Paneer Tikka', price: 280, veg: true },
  { id: 2, name: 'Chicken Biryani', price: 350, veg: false },
  { id: 3, name: 'Masala Dosa', price: 120, veg: true },
];

// The list does the looping. The page can pass a template to decide how ONE row looks.
@Component({
  selector: 'app-menu-list',
  imports: [NgTemplateOutlet],
  template: `
    <ul>
      @for (dish of dishes(); track dish.id) {
        <li>
          @if (rowTemplate(); as template) {
            <!-- ng-container adds no element to the page. It only holds the template. -->
            <ng-container *ngTemplateOutlet="template; context: { $implicit: dish }" />
          } @else {
            {{ dish.name }}
          }
        </li>
      }
    </ul>
  `,
})
export class MenuList {
  dishes = input.required<Dish[]>();
  rowTemplate = input<TemplateRef<{ $implicit: Dish }>>();
}
