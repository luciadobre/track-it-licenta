import * as XLSX from "xlsx";
import Button from "../../@atoms/Button";
import type { RouterOutputs } from "~/trpc/react";

interface ExportToExcelProps {
  items: RouterOutputs["item"]["display"]["items"];
}

const ExportToExcel = ({ items }: ExportToExcelProps) => {
  if (!items.length) return null;

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      items.map((item) => item.excelRow),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Items");

    XLSX.writeFile(workbook, "selected_items.xlsx");
  };

  return (
    <Button intent="secondary" text="Descarca Excel" onClick={handleExport} />
  );
};

export default ExportToExcel;
