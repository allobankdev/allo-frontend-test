export function formatDateIndo(dateString: string): string {
    if (!dateString) return '-'
  
    const date = new Date(dateString)
  
    if (isNaN(date.getTime())) return '-'
  
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }  