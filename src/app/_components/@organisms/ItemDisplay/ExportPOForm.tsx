import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Select from "../../@atoms/Select";
import Button from "../../@atoms/Button";
import Input from "../../@atoms/Input";
import { api } from "~/trpc/react";

type POItem = {
  id: number;
  itemNumber: string;
  itemName: string;
  UOM: string;
  price: number;
  quantity: number;
};

const poNumber = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `PO-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(Math.random() * 900) + 100}`;
};

const ExportPOForm = ({ selectedItems }: { selectedItems: POItem[] }) => {
  const [addressId, setAddressId] = useState("");
  const [localItems, setLocalItems] = useState<POItem[]>(selectedItems);
  const { data: company } = api.company.getCompany.useQuery();
  if (!company) return null;

  const shippingAddresses = company.shippingAddresses.map((a) => ({
    label: `${a.name} - ${a.address}`,
    value: String(a.id),
  }));

  const updateItem = (id: number, field: "quantity" | "price", raw: string) => {
    const value = parseFloat(raw);
    if (isNaN(value) || value < 0) return;
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const subtotal = localItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generatePO = () => {
    const selectedAddress = company.shippingAddresses.find(
      (a) => String(a.id) === addressId,
    );
    if (!selectedAddress) return alert("Alege adresa de livrare.");

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 14;

    const po = poNumber();
    doc.setFontSize(10);
    doc.text(`Comanda: ${po}  |  ${new Date().toLocaleDateString("ro-RO")}`, margin, 16);
    doc.text(`De la: ${company.name}, ${company.address}`, margin, 24);
    doc.text(`Catre: ${selectedAddress.name}, ${selectedAddress.address}`, margin, 30);

    autoTable(doc, {
      startY: 38,
      margin: { left: margin, right: margin },
      head: [["#", "Cod", "Articol", "UM", "Cant.", "Pret", "Total"]],
      body: localItems.map((item, i) => [
        i + 1, item.itemNumber, item.itemName, item.UOM, item.quantity,
        `${item.price.toFixed(2)} RON`,
        `${(item.price * item.quantity).toFixed(2)} RON`,
      ]),
    });

    // @ts-expect-error jspdf-autotable augments doc
    const afterTable = (doc.lastAutoTable.finalY as number) + 6;
    doc.text(`Total: ${subtotal.toFixed(2)} RON`, margin, afterTable);
    doc.text("Aprobat: ______________________", margin, afterTable + 8);

    doc.save(`comanda-${po}.pdf`);
  };

  return (
    <div className="border-border bg-panel space-y-4 rounded-lg border p-6">
      <h2 className="text-xl font-semibold">Export PO</h2>

      <Select
        value={addressId}
        onChange={setAddressId}
        options={[
          { label: "Alege adresa de livrare", value: "", disabled: true },
          ...shippingAddresses,
        ]}
      />

      <table className="w-full text-sm">
        <thead>
          <tr className="border-border text-text-secondary border-b text-left text-xs">
            <th className="pb-2">Articol</th>
            <th className="pb-2 text-center">UM</th>
            <th className="pb-2 text-center">Cant.</th>
            <th className="pb-2 text-right">Pret</th>
            <th className="pb-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {localItems.map((item) => (
            <tr key={item.id} className="border-border border-b last:border-0">
              <td className="py-2">
                <div className="font-medium">{item.itemName}</div>
                <div className="text-text-secondary text-xs">{item.itemNumber}</div>
              </td>
              <td className="text-text-secondary py-2 text-center">{item.UOM}</td>
              <td className="py-1 text-center">
                <Input
                  type="number"
                  min={0}
                  value={String(item.quantity)}
                  onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  className="mx-auto w-20"
                />
              </td>
              <td className="py-1 text-right">
                <Input
                  type="number"
                  min={0}
                  value={String(item.price)}
                  onChange={(e) => updateItem(item.id, "price", e.target.value)}
                  className="ml-auto w-24"
                />
              </td>
              <td className="py-2 text-right font-medium">
                {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="pt-3 text-right text-sm font-semibold">
              Total
            </td>
            <td className="pt-3 text-right font-bold">
              {subtotal.toFixed(2)} RON
            </td>
          </tr>
        </tfoot>
      </table>

      <Button
        onClick={generatePO}
        disabled={!localItems.length}
        text={`Genereaza PO (${localItems.length} articole)`}
      />
    </div>
  );
};

export default ExportPOForm;
