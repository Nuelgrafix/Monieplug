
export const formatCurrency = (amount: number | undefined, currency: string) => {
  if (amount === undefined || amount === null) return "N/A";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
};




