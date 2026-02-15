import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pitch } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateShareableLink(pitchId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/share/${pitchId}`;
}

export function downloadAsPDF(content: string, filename: string): void {
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();

    doc.setFont('helvetica');

    const lines = content.split('\n');
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 7;
    const margin = 20;

    lines.forEach((line) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      if (line.trim()) {
        if (line.match(/^[A-Z\s]+:$/)) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(line, margin, yPosition);
          yPosition += lineHeight + 2;
        } else {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const maxWidth = doc.internal.pageSize.width - (margin * 2);
          const splitLines = doc.splitTextToSize(line, maxWidth);
          doc.text(splitLines, margin, yPosition);
          yPosition += lineHeight * splitLines.length;
        }
      } else {
        yPosition += lineHeight / 2;
      }
    });

    doc.save(`${filename}.pdf`);
  }).catch((error) => {
    console.error('Error generating PDF:', error);
    throw error;
  });
}

export function downloadPitchAsPDF(pitch: Pitch, filename: string): void {
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();

    doc.setFont('helvetica');

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(pitch.startup_name, 20, 30);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text(`"${pitch.tagline}"`, 20, 45);

    let yPosition = 60;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 7;
    const margin = 20;

    const addSection = (title: string, content: string) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, yPosition);
      yPosition += lineHeight + 3;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const maxWidth = doc.internal.pageSize.width - (margin * 2);
      const splitLines = doc.splitTextToSize(content, maxWidth);
      doc.text(splitLines, margin, yPosition);
      yPosition += lineHeight * splitLines.length + 10;
    };

    addSection('PROBLEM:', pitch.problem);
    addSection('SOLUTION:', pitch.solution);
    addSection('TARGET AUDIENCE:', pitch.target_audience);
    addSection('ELEVATOR PITCH:', pitch.pitch);
    addSection('LANDING PAGE COPY:', pitch.landing_copy);

    if (pitch.color_palette) {
      addSection('COLOR PALETTE:', pitch.color_palette);
    }

    if (pitch.logo_concept) {
      addSection('LOGO CONCEPT:', pitch.logo_concept);
    }

    doc.save(`${filename}.pdf`);
  }).catch((error) => {
    console.error('Error generating PDF:', error);
    throw error;
  });
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        resolve();
      } else {
        reject();
      }
      textArea.remove();
    });
  }
}

