export const formatCost = (cost: number | null | undefined): string => {
  if (!cost) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(cost)
}

export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A'
  const parsedDate = new Date(dateStr)
  if (isNaN(parsedDate.getTime())) return 'N/A'
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
