"use client";
import { useState } from "react";
import Link from "next/link";
import ErrorMessage from "../../@atoms/ErrorMessage";
import Loading from "../../@atoms/Loading";
import Button from "../../@atoms/Button";
import SearchBar from "../../@atoms/Search";
import Select from "../../@atoms/Select";
import Pagination from "../../@molecules/Pagination";
import ExportExcel from "./ExportExcel";
import ExportPOForm from "./ExportPOForm";
import InventoryCharts from "./InventoryCharts";
import ItemCard from "./ItemCard";
import { useItemDisplayData } from "./useItemDisplayData";

const ItemsDisplay = () => {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const { status, items, visibleIds, filters, pagination } =
    useItemDisplayData();
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  const toggleItem = (itemId: number) => {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(itemId)) {
        return currentIds.filter((id) => id !== itemId);
      }

      return [...currentIds, itemId];
    });
  };

  const toggleSelectMode = () => {
    setSelectMode((mode) => !mode);
    setSelectedIds([]);
  };

  if (status.isLoading) return <Loading />;
  if (status.error) return <ErrorMessage message={status.error.message} />;

  return (
    <div className="space-y-6">
      <div className="border-border bg-panel grid gap-3 rounded-lg border p-4 md:grid-cols-3">
        <SearchBar
          onSearch={filters.setItemNumber}
          placeholder="Cauta cod articol"
        />
        <SearchBar
          onSearch={filters.setItemName}
          placeholder="Cauta nume articol"
        />
        <Select
          value={filters.locationId}
          onChange={filters.setLocationId}
          options={filters.locationOptions}
        />
      </div>

      <InventoryCharts />

      <div className="flex flex-wrap gap-3">
        <Button
          text={selectMode ? "Renunta la selectie" : "Alege articole"}
          onClick={toggleSelectMode}
        />
        {selectMode && (
          <Button
            text="Alege pagina curenta"
            onClick={() => setSelectedIds(visibleIds)}
          />
        )}
        <Link
          href="/dashboard/stock-sales"
          className="border-border bg-box-background-light text-text-base hover:bg-box-background-hover rounded-md border px-3 py-2 text-sm"
        >
          Adauga miscare
        </Link>
      </div>

      {selectMode && (
        <div className="flex flex-wrap gap-3">
          <Button
            text="Genereaza PO"
            onClick={() => setShowPurchaseOrder((show) => !show)}
          />
          <ExportExcel items={selectedItems} />
        </div>
      )}

      {showPurchaseOrder && (
        <ExportPOForm key={selectedIds.join(",")} selectedItems={selectedItems} />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            selection={{
              active: selectMode,
              selected: selectedIds.includes(item.id),
              toggle: toggleItem,
            }}
          />
        ))}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={pagination.setPage}
      />
    </div>
  );
};

export default ItemsDisplay;
