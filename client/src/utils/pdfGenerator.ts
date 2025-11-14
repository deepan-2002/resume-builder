import type { Resume } from '../types/resume.types';

export const generatePdf = async (resume: Resume) => {
  // Placeholder for a real PDF pipeline (e.g., pdfmake or jsPDF)
  console.info('PDF generation triggered for', resume.title);
};

