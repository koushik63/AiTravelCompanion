export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const code = (currency || 'INR').toUpperCase().trim();
  switch (code) {
    case 'INR':
      return `₹${amount.toLocaleString('en-IN')}`;
    case 'USD':
      return `$${amount.toLocaleString()}`;
    case 'EUR':
      return `€${amount.toLocaleString()}`;
    case 'GBP':
      return `£${amount.toLocaleString()}`;
    case 'AED':
      return `AED ${amount.toLocaleString()}`;
    case 'JPY':
      return `¥${amount.toLocaleString()}`;
    case 'CAD':
      return `CA$${amount.toLocaleString()}`;
    case 'AUD':
      return `AU$${amount.toLocaleString()}`;
    default:
      return `${code} ${amount.toLocaleString()}`;
  }
};
