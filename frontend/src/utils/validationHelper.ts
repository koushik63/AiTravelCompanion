export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isMinLength = (str: string, length: number): boolean => {
  return str.trim().length >= length;
};
