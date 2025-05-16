
import { toast } from "@/components/ui/sonner";

export type ExportFormat = "csv" | "excel" | "pdf";

export const exportData = (
  data: any[],
  filename: string,
  format: ExportFormat = "csv"
) => {
  // In a real app, this would generate and download a file in the specified format
  // For demo purposes, we'll just show a toast message
  
  toast.success(
    `Данные экспортированы в формате ${format.toUpperCase()}`,
    {
      description: `Файл: ${filename}.${format}, записей: ${data.length}`,
    }
  );
  
  console.log("Экспорт отчета", {
    data,
    filename,
    format
  });
};
