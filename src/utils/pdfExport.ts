import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  scale?: number;
  orientation?: 'portrait' | 'landscape';
}

export const exportToPDF = async (
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    filename = 'gia-pha.pdf',
    scale = 2,
    orientation = 'landscape'
  } = options;

  try {
    // 🔹 Clone element để tránh dính transform zoom
    const clonedElement = element.cloneNode(true) as HTMLElement;

    clonedElement.style.transform = 'none';
    clonedElement.style.position = 'static';
    clonedElement.style.left = '0';
    clonedElement.style.top = '0';

    // 🔹 Tạo container ẩn
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-100000px';
    container.style.top = '0';
    container.style.background = '#ffffff';
    container.appendChild(clonedElement);

    document.body.appendChild(container);

    // Đợi layout render xong
    await new Promise(resolve => setTimeout(resolve, 500));

    // 🔹 Capture canvas
    const canvas = await html2canvas(clonedElement, {
      scale,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: clonedElement.scrollWidth,
      windowHeight: clonedElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = orientation === 'portrait' ? 210 : 297;
    const pdfHeight = orientation === 'portrait' ? 297 : 210;

    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = pdfHeight - margin * 2;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = contentWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    let remainingHeight = scaledHeight;
    let position = 0;

    // 🔹 Xuất nhiều trang chuẩn
    while (remainingHeight > 0) {
      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        margin - position,
        contentWidth,
        scaledHeight
      );

      remainingHeight -= contentHeight;
      position += contentHeight;

      if (remainingHeight > 0) {
        pdf.addPage();
      }
    }

    pdf.save(filename);

    document.body.removeChild(container);

  } catch (error) {
    console.error('Export PDF error:', error);
    throw new Error('Không thể xuất PDF');
  }
};