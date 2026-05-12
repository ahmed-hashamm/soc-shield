"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface AnalyticsData {
  threatCategories: { name: string; value: number }[];
  topTLDs: { name: string; value: number }[];
  blockSources: { name: string; value: number }[];
  weeklyTrend: { date: string; count: number }[];
}

export function ExportPDFButton({ data }: { data: AnalyticsData }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Calculate Total Threats
      const totalThreats = data.threatCategories.reduce((sum, item) => sum + item.value, 0);

      // --- Header ---
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59); // Slate 800
      doc.text("SOC Browser Shield", 14, 22);
      
      doc.setFontSize(14);
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text("Threat Intelligence Report", 14, 30);
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 38);
      
      // --- Summary Metrics ---
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42); // Slate 900
      doc.text(`Total Threats Logged (Last 30 Days): ${totalThreats}`, 14, 50);

      let currentY = 60;

      // --- 7-Day Trend Table ---
      autoTable(doc, {
        startY: currentY,
        head: [['Date', 'Blocked Requests']],
        body: data.weeklyTrend.map(item => [item.date, item.count]),
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;

      // --- Threat Categories Table ---
      autoTable(doc, {
        startY: currentY,
        head: [['Threat Category', 'Incidents']],
        body: data.threatCategories.map(item => [item.name.toUpperCase(), item.value]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }, // Blue 500
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Check for page break
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      // --- Top Targeted TLDs Table ---
      autoTable(doc, {
        startY: currentY,
        head: [['Top-Level Domain (TLD)', 'Incidents']],
        body: data.topTLDs.map(item => [item.name, item.value]),
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] }, // Violet 500
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;

      // Check for page break
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      // --- Decision Sources Table ---
      autoTable(doc, {
        startY: currentY,
        head: [['Decision Source Engine', 'Incidents']],
        body: data.blockSources.map(item => [item.name.replace(/_/g, ' ').toUpperCase(), item.value]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, // Emerald 500
        margin: { left: 14, right: 14 }
      });

      // --- Footer ---
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.text(
          `Page ${i} of ${pageCount} - Strictly Confidential`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      doc.save(`SOC_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("PDF Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportPDF}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/3 border border-white/5 text-zinc-300 hover:text-white hover:bg-white/8 hover:border-neon-blue/30 transition-all font-black uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin text-neon-blue" />
      ) : (
        <Download className="w-4 h-4 text-zinc-500 group-hover:text-neon-blue transition-colors" />
      )}
      {isExporting ? "Generating..." : "Export Report"}
    </button>
  );
}
