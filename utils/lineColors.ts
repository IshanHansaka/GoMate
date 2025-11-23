export const getLineColor = (
  lineCode: string | null,
  defaultColor: string = '#eee'
) => {
  switch (lineCode) {
    case 'RD':
      return '#D11241';
    case 'BL':
      return '#0072CE';
    case 'YL':
      return '#FFD100';
    case 'OR':
      return '#D45D00';
    case 'GR':
      return '#00B140';
    case 'SV':
      return '#919D9D';
    default:
      return defaultColor;
  }
};
