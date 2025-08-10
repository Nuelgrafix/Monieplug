"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import React from "react";
import styles from "./filter-search.module.css";
import SvgIcon from "../svg-icon/svg-icon.component";

function FilterSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <SvgIcon
        className="!text-[#667085] w-[13px] h-[13px]"
        iconName="FaSearch"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleInputChange}
        className={styles.input}
      />
    </form>
  );
}

export default FilterSearch;
