import * as XLSX from 'xlsx';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('es-MX');
};

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Datos') => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!worksheet[address]) continue;
    worksheet[address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E2E8F0' } },
    };
  }

  const colWidths = data.reduce((acc: any, row: any) => {
    Object.keys(row).forEach((key, i) => {
      const value = String(row[key] || '');
      const headerLength = key.length;
      const valueLength = value.length;
      acc[i] = Math.max(acc[i] || 10, headerLength + 2, Math.min(valueLength + 2, 50));
    });
    return acc;
  }, []);

  worksheet['!cols'] = colWidths.map((w: number) => ({ wch: w }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
