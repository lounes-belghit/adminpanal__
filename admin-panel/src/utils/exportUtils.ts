/**
 * Utility to export an array of objects to a CSV file.
 * @param data Array of objects to export
 * @param fileName Desired name of the exported file
 */
export const exportToCSV = (data: any[], fileName: string) => {
    if (data.length === 0) return;

    // Extract headers
    const headers = Object.keys(data[0]);

    // Map rows
    const rows = data.map((obj) =>
        headers
            .map((header) => {
                const value = obj[header];
                // Handle values that might contain commas or newlines
                const stringValue = value !== null && value !== undefined ? String(value) : '';
                if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            })
            .join(',')
    );

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
