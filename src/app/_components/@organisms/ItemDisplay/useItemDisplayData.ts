"use client";

import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { api } from "~/trpc/react";

const PAGE_SIZE = 6;

type ItemSearch = {
  itemNumber: string;
  itemName: string;
  locationId: string;
};

const defaultSearch: ItemSearch = {
  itemNumber: "",
  itemName: "",
  locationId: "",
};

export const useItemDisplayData = () => {
  const [search, setSearch] = useState(defaultSearch);
  const [page, setPage] = useState(1);

  const query = api.item.display.useQuery(
    {
      itemNumber: search.itemNumber || undefined,
      itemName: search.itemName || undefined,
      locationId: search.locationId ? Number(search.locationId) : undefined,
      page,
      pageSize: PAGE_SIZE,
    },
    { placeholderData: keepPreviousData },
  );
  const { data: locationOptions = [] } = api.location.options.useQuery();

  const resetToFirstPage = () => {
    setPage(1);
  };

  const setItemNumber = (itemNumber: string) => {
    setSearch((current) => ({ ...current, itemNumber }));
    resetToFirstPage();
  };

  const setItemName = (itemName: string) => {
    setSearch((current) => ({ ...current, itemName }));
    resetToFirstPage();
  };

  const setLocationId = (locationId: string) => {
    setSearch((current) => ({ ...current, locationId }));
    resetToFirstPage();
  };

  return {
    status: { isLoading: query.isLoading, error: query.error },
    items: query.data?.items ?? [],
    visibleIds: query.data?.itemIds ?? [],
    filters: {
      locationId: search.locationId,
      locationOptions,
      setItemNumber,
      setItemName,
      setLocationId,
    },
    pagination: {
      page,
      totalPages: query.data?.pagination.totalPages ?? 0,
      setPage,
    },
  };
};
