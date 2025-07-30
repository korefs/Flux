export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const formatDateInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};