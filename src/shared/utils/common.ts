export const getImagePath = (mode: string, dbName?: string, image?: string): string | undefined => {
  if (!dbName || !image) return undefined;
  const url = import.meta.env.VITE_RESOURCE_URL || import.meta.env.VITE_BASE_SERVER_URL;

  return `${url}/${dbName}/${mode}/${image}`;
};

export const formatNumberWithComma = (num: number | string): string => {
  const number = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(number)) return "0";
  return number.toLocaleString("th-TH");
};
