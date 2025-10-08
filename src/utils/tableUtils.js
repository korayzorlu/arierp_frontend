export const trLocalizedSum = {
  apply: ({ values }) => {
    const total = values.reduce((sum, val) => {
      const num = parseLocalizedAmount(val);
      return sum + (Number.isFinite(num) ? num : 0);
    }, 0);
    return total;
  },
  label: 'Toplam', // footer başlığı
  valueFormatter: (value) =>
    new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value),
};