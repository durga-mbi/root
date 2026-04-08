export const getProductMainImage = (product: any): string | null => {
  if (!product) return null;
  return product.proimg || product.images?.[0]?.proimgs || null;
};
