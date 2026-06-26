"use client";

import React, { useState } from "react";
import { debounce } from "lodash";
import { IoMdSearch } from "react-icons/io";
import Input from "./Input";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const DEBOUNCE_TIME = 300;

const SearchBar = ({
  onSearch,
  placeholder = "Cauta...",
}: SearchBarProps) => {
  const [value, setValue] = useState("");

  const debouncedSearch = debounce((searchTerm: string) => {
    onSearch(searchTerm);
  }, DEBOUNCE_TIME);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    debouncedSearch(event.target.value);
  };

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      <IoMdSearch className="text-text-secondary pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg" />
    </div>
  );
};

export default SearchBar;
