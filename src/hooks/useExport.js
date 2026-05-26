import { useState } from 'react';
import { exportToExcel } from '../utils/exportExcel';
import { exportToPPTX } from '../utils/exportPPTX';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [lastExport, setLastExport] = useState(null);
  const [error, setError] = useState(null);

  const handleExcel = async (config = {}) => {
    setIsExporting(true);
    setExportType('excel');
    setError(null);
    try {
      const filename = await exportToExcel(config);
      setLastExport({ type: 'excel', filename, date: new Date() });
      return filename;
    } catch (err) {
      setError(err.message || 'Excel export hatası');
      throw err;
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handlePPTX = async (config = {}) => {
    setIsExporting(true);
    setExportType('pptx');
    setError(null);
    try {
      const filename = await exportToPPTX(config);
      setLastExport({ type: 'pptx', filename, date: new Date() });
      return filename;
    } catch (err) {
      setError(err.message || 'PPTX export hatası');
      throw err;
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return {
    exportToExcel: handleExcel,
    exportToPPTX: handlePPTX,
    isExporting,
    exportType,
    lastExport,
    error,
  };
}
