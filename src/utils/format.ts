export const NOT_AVAILABLE = 'Not available'

export const formatCost = (cost: string | null) => {
  const value = Number(cost)
  if (!cost || !Number.isFinite(value)) return NOT_AVAILABLE

  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD'
  }).format(value)
}


export const formatDate = (date: string | null) => {
  const parsed = date ? new Date(date) : null
  if (!parsed || Number.isNaN(parsed.getTime())) return NOT_AVAILABLE

  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(parsed)
}
