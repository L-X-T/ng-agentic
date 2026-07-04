// Intentional exercise defect. Keep this starter red in the teaching repository.
// Prices are integer cents; quantities are positive integers.
export function orderTotal(lines) {
  return lines.reduce((total, line) => total + line.unitPriceCents + line.quantity, 0);
}
