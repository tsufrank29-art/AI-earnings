import React from 'react';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜尋個股名稱或代號"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
      />
    </div>
  );
}

export default SearchBar;
