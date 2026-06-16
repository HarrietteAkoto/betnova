"use client";

import { useBetslipStore, type Selection } from "../store/useBetslipStore";

export interface OddsButtonProps {
  selection: Selection;
}

export function OddsButton({ selection }: OddsButtonProps) {
  const { selections, addSelection, removeSelection } = useBetslipStore();
  const isSelected = selections.some((s) => s.id === selection.id);

  const handleClick = () => {
    if (isSelected) {
      removeSelection(selection.id);
    } else {
      addSelection(selection);
    }
  };

  return (
    <button 
      className={`flex flex-col items-center justify-center w-full py-3 h-auto rounded-md text-sm font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 ${
        isSelected 
          ? "bg-green-500 text-gray-950 border-green-500" 
          : "border-gray-800 bg-transparent hover:bg-gray-800 text-white"
      }`}
      onClick={handleClick}
    >
      <span className={`text-xs mb-1 ${isSelected ? "text-gray-950/70" : "text-gray-500"}`}>
        {selection.outcome.split(" ").pop()}
      </span>
      <span className={`font-bold ${isSelected ? "text-gray-950" : "text-white"}`}>
        {selection.odds.toFixed(2)}
      </span>
    </button>
  );
}