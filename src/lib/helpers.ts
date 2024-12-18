const priceFormatter = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(price: number) {
  return priceFormatter.format(price);
}
