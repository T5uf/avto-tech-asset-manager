
// Simple file upload utility for demo purposes
// In a real application, this would connect to a backend service

export const uploadFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate upload delay
    setTimeout(() => {
      // Create a local URL for the file
      const fileUrl = URL.createObjectURL(file);
      resolve(fileUrl);
    }, 1000);
  });
};

export const generateQRCode = (text: string): Promise<string> => {
  return new Promise((resolve) => {
    // In a real app, this would generate a QR code using a library
    // For demo purposes, we'll return a placeholder QR code
    const qrPlaceholder = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
    resolve(qrPlaceholder);
  });
};
