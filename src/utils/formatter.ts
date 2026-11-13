export const formatCurrency = (value: string | null): string => {
    let cost = "";
    
    if (value) {
        cost = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(Number(value));
    } else {
        cost = "N/A"
    }

    return cost;
  
};

export const formatDate = (value: string | null): string => {
    let transformedDate = '';

    if (value) {
        const [year, month, day] = value.split("-").map(Number);

        const date = new Date(year, month - 1, day);

        transformedDate = Intl.DateTimeFormat("en-EN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date);
    } else {
        transformedDate = 'N/A'
    }

    return transformedDate;
};
