export const getImageUrl = (image) => {
  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
  if (!image) return "/placeholder-product.png";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/uploads")) return `${API_BASE_URL}${image}`;
  return `${API_BASE_URL}/uploads/${image}`;
};
