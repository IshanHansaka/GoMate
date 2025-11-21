export const LINE_NAMES: { [code: string]: string } = {
  RD: 'Red',
  BL: 'Blue',
  GR: 'Green',
  YL: 'Yellow',
  OR: 'Orange',
  SV: 'Silver',
};

export const getLineName = (code?: string | null) => {
  if (!code) return '';
  return LINE_NAMES[code] || code;
};
