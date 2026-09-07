export function useFormatters() {
  const formatDate = (date: string | null): string => {
    if (!date) {
      return 'Not available'
    }
    
    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) {
        return 'Not available'
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'Not available'
    }
  }

  const formatCurrency = (cost: string | null): string => {
    if (!cost) {
      return 'Not available'
    }
    return cost
  }

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength) + '...'
  }

  return {
    formatDate,
    formatCurrency,
    truncateText,
  }
}
