import assert from 'node:assert/strict';
import test from 'node:test';
import { orderTotal } from './order-total.mjs';

test('an empty order costs zero cents', () => {
  assert.equal(orderTotal([]), 0);
});
test('three tickets at 1200 cents cost 3600 cents', () => {
  assert.equal(orderTotal([{ unitPriceCents: 1200, quantity: 3 }]), 3600);
});
test('an order adds the costs of all line quantities', () => {
  assert.equal(
    orderTotal([
      { unitPriceCents: 1200, quantity: 2 },
      { unitPriceCents: 500, quantity: 1 },
    ]),
    2900,
  );
});
