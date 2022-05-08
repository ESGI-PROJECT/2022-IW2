/**
 * Transforms an amount in `cents` into a human-readable amount in dollars.
 * @example
 * toDollars(1000) // returns $10.00
 * @param {number} cents
 * @returns {string} A human-readable amount in dollars.
 */
export function toDollars(cents) {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
