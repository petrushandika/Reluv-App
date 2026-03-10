/**
 * Utility to export an array of objects to a CSV file
 * @param data Array of objects to export
 * @param filename Desired filename
 */
export const exportToCsv = (data: any[], filename: string) => {
  if (!data || !data.length) {
    alert("No data to export");
    return;
  }

  // Extract headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV rows
  const csvRows = [
    headers.join(','), // header row
    ...data.map(row => {
      return headers.map(header => {
        const val = row[header];
        // Handle nested objects or arrays (simplified)
        const cellValue = typeof val === 'object' && val !== null 
          ? JSON.stringify(val).replace(/"/g, '""')
          : String(val).replace(/"/g, '""');
        return `"${cellValue}"`;
      }).join(',');
    })
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
