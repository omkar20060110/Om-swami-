export const getResourceUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  // Handle legacy /static/uploads/ by converting to /uploads/
  const cleanPath = url.replace('/static/uploads/', '/uploads/');
  
  // Ensure we always have the API prefix and correct base URL
  return `/api${cleanPath}`;
};
