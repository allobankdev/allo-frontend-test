export const formatCurrency = (val: string | number | null | undefined) => {
  let value: number

  if (!val) value = 0
  else if (typeof val === "string") value = parseFloat(val)
  else value = val

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value)
}