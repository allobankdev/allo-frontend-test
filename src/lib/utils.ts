export const formatCurrency = (
  value: number,
  locale = "en-US",
  currency = "USD"
): string => {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value
  );
};

export const convertImgToUrl = (image: File): string => {
  return URL.createObjectURL(image);
  // return new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     resolve(reader.result as string);
  //   };

  //   reader.onerror = (error) => {
  //     reject(error);
  //   };

  //   reader.readAsDataURL(image);
  // });
};
