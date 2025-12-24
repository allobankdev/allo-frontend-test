export const formatCurrency = (
    value: number,
    locale = "en-USD",
    currency = "USD"
): string => {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
       value
    );
};