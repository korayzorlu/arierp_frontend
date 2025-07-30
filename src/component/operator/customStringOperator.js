import { getGridStringOperators } from '@mui/x-data-grid';

// Türkçe karakterleri normalize eden yardımcı fonksiyon
function turkishNormalize(str) {
  if (!str) return '';
  return str
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ş/g, 'ş')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase();
}

// Tüm string filtreleme operatörlerini özelleştir
const customStringOperators = getGridStringOperators().map((operator) => {
  if (operator.value !== 'contains') return operator;

  return {
    ...operator,
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.value) return null;

      const searchValue = turkishNormalize(filterItem.value);

      return (params) => {
        const cellValue = turkishNormalize(params.value);
        return cellValue.includes(searchValue);
      };
    },
  };
});

export default customStringOperators;