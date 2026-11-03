export const SALES = [
  { name: 'Jan', sales: 40 },
  { name: 'Feb', sales: 65 },
  { name: 'Mar', sales: 50 },
  { name: 'Apr', sales: 90 },
  { name: 'May', sales: 110 },
  { name: 'Jun', sales: 75 },
];

export interface Dish {
  id: number;
  name: string;
  price: number;
}

export const DISHES: Dish[] = Array.from({ length: 300 }, (_, i) => ({ id: i + 1, name: `Dish ${i + 1}`, price: 100 + (i % 20) * 10 }));

// Pretend this is expensive: taxes, discounts, offers, currency formatting...
export function priceWithTax(dish: Dish): number {
  let x = dish.price;
  for (let i = 0; i < 100000; i++) {
    x = Math.sqrt(x * x + 1) - 0.00001;
  }
  return Math.round(dish.price * 1.05);
}
