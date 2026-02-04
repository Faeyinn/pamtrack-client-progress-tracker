"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileText } from "lucide-react";
import { Project } from "@/lib/types/project";
import { toast } from "sonner";

interface AnalyticsExportProps {
  projects: Project[];
}

export function AnalyticsExport({ projects }: AnalyticsExportProps) {
  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const csvHeaders = [
        "Proyek",
        "Klien",
        "Status",
        "Progress (%)",
        "Deadline",
        "Dibuat",
      ];

      const csvData = projects.map((p) => [
        `"${p.projectName}"`,
        `"${p.clientName}"`,
        `"${p.status}"`,
        p.progress,
        p.deadline,
        p.createdAt,
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvData.map((row) => row.join(",")),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `project-tracker-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diekspor ke CSV");
    } catch (error) {
      console.error("Export CSV failed:", error);
      toast.error("Gagal mengekspor data CSV");
    }
  };

  const exportToJSON = () => {
    try {
      // Prepare JSON data with statistics
      const stats = {
        totalProjects: projects.length,
        completedProjects: projects.filter((p) => p.status === "Done").length,
        activeProjects: projects.filter((p) => p.status === "On Progress").length,
        averageProgress: Math.round(
          projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
        ),
        exportDate: new Date().toISOString(),
      };

      const jsonData = {
        summary: stats,
        projects: projects,
      };

      // Create blob and download
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `project-tracker-${new Date().toISOString().split("T")[0]}.json`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diekspor ke JSON");
    } catch (error) {
      console.error("Export JSON failed:", error);
      toast.error("Gagal mengekspor data JSON");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs font-bold"
          title="Export dashboard data"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-bold">
          Ekspor Data
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer gap-2">
          <FileText className="w-4 h-4" />
          <div>
            <p className="font-medium">Export CSV</p>
            <p className="text-xs text-muted-foreground">Spreadsheet format</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer gap-2">
          <FileJson className="w-4 h-4" />
          <div>
            <p className="font-medium">Export JSON</p>
            <p className="text-xs text-muted-foreground">Dengan statistik</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
