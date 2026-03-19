"use client";

import { useState, useRef } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Item } from "@/lib/mockItems";

interface PriceTableProps {
  items: Item[];
  action: string;
  selectedRowId: string | null;
  onSelectRow: (id: string | null) => void;
  onPriceChange: (itemId: string, newPrice: number) => void;
  edits: Record<string, { userAdjustedPrice?: number }>;
  search: string;
  onSearchChange: (value: string) => void;
}

export function PriceTable(props: PriceTableProps) {
  const {
    items,
    action,
    selectedRowId,
    onSelectRow,
    onPriceChange,
    edits,
    search,
    onSearchChange,
  } = props;

  const [
    editingId, 
    setEditingId
  ] = useState<string | null>(null);

  const [
    editValue, 
    setEditValue
  ] = useState("");
  
  const editInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(query) ||
      item.item.toLowerCase().includes(query)
    );
  });

  const getUserAdjustedPrice = (itemId: string, defaultPrice: number) => {
    return edits[itemId]?.userAdjustedPrice ?? defaultPrice;
  };

  const getPercentChange = (itemId: string, rp: number) => {
    const userPrice = getUserAdjustedPrice(itemId, rp);
    return ((userPrice - rp) / rp) * 100;
  };

  const handleEditStart = (itemId: string, currentPrice: number) => {
    setEditingId(itemId);
    setEditValue(currentPrice.toFixed(2));
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const handleEditSave = (itemId: string) => {
    const newPrice = parseFloat(editValue);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onPriceChange(itemId, newPrice);
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === "Enter") {
      handleEditSave(itemId);
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div className="rounded-2xl border-2 border-white/20 bg-white/[0.08] backdrop-blur-2xl shadow-[0_8_32px] shadow-violet-600/20 overflow-hidden">
      {/* Search Toolbar */}
      <div className="p-4 border-b border-white/10">
        <input
          type="text"
          placeholder="Search by item name or code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-white/15 bg-white/5 backdrop-blur-xl
                     text-white placeholder-white/40
                     focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-black
                     transition"
        />
      </div>

      {/* Table */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center text-white/60">
          No items match your filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left font-semibold text-white/90 w-12">
                  Select
                </th>
                <th className="px-4 py-3 text-left font-semibold text-white/90">
                  Department
                </th>
                <th className="px-4 py-3 text-left font-semibold text-white/90">
                  Region
                </th>
                <th className="px-4 py-3 text-left font-semibold text-white/90">
                  Item Code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-white/90">
                  Item Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-white/90">
                  Item Description
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white/90">
                  CP ($)
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white/90">
                  Original RP ($)
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white bg-violet-500/25 border-l border-r border-violet-400/40 rounded-lg">
                  Optimized RP ($)
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white/90">
                  % Change
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white bg-emerald-500/25 border-l border-r border-emerald-400/40 rounded-lg">
                  User Adjusted Price ($)
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white/90">
                  Weekly Unit CP
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white/90">
                  Weekly Unit RP
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white/90">
                  Weekly Profit CP ($)
                </th>
                <th className="px-4 py-3 text-right font-semibold text-white/90">
                  Weekly Optimized Profit RP ($)
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => {
                const isSelected = selectedRowId === item.id;
                const userPrice = getUserAdjustedPrice(item.id, item.rp);
                const percentChange = getPercentChange(item.id, item.rp);
                const weeklyCostRevenue = item.weeklyUnits * item.cp;
                const weeklyUserRevenue = item.weeklyUnits * userPrice;
                const weeklyProfit =
                  item.weeklyUnits * Math.max(userPrice - item.cp, 0);

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-white/5 transition-all duration-300 ${
                      isSelected ? "bg-violet-500/20" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          onSelectRow(isSelected ? null : item.id)
                        }
                        className="w-4 h-4 rounded cursor-pointer accent-violet-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-white/90">
                      {item.departmentDescription}
                    </td>
                    <td className="px-4 py-3 text-white/80 capitalize">
                      {item.region}
                    </td>
                    <td className="px-4 py-3 text-white/80 font-mono text-xs">
                      {item.item}
                    </td>
                    <td className="px-4 py-3 text-white/90 font-medium">
                      {item.itemName}
                    </td>
                    <td className="px-4 py-3 text-white/70 text-xs">
                      {item.itemDescription}
                    </td>
                    <td className="px-4 py-3 text-right text-white/90 font-mono">
                      ${item.cp.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-white/90 font-mono">
                      ${item.rp.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-mono font-semibold bg-violet-500/20 border-l border-r border-violet-400/30">
                      ${item.rp.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono text-sm ${
                        percentChange > 0
                          ? "text-emerald-400"
                          : percentChange < 0
                            ? "text-rose-400"
                            : "text-white/80"
                      }`}
                    >
                      {percentChange > 0 ? "+" : ""}
                      {percentChange.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right bg-emerald-500/15 border-l border-r border-emerald-400/25">
                      {editingId === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <input
                            ref={editInputRef}
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, item.id)}
                            onBlur={() => handleEditSave(item.id)}
                            className="w-20 px-2 py-1 rounded-lg border border-violet-400 bg-white/10 text-white text-sm
                                     focus:outline-none focus:ring-2 focus:ring-violet-400/60"
                          />
                          <button
                            onClick={() => handleEditSave(item.id)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 group">
                          <span className="text-white font-mono font-semibold">
                            ${userPrice.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleEditStart(item.id, userPrice)}
                            className="text-emerald-400 hover:text-emerald-300 hover:scale-110 transition-all duration-200 opacity-80 group-hover:opacity-100"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-white/90 font-mono">
                      {item.weeklyUnits}
                    </td>
                    <td className="px-4 py-3 text-right text-white/90 font-mono">
                      ${weeklyCostRevenue.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-white/90 font-mono">
                      $0.00
                    </td>
                    <td className="px-4 py-3 text-right text-white/90 font-mono">
                      ${weeklyProfit.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end p-4 border-t border-white/10">
        <button
          className="px-4 py-2 rounded-xl border border-white/20 text-white/80 text-sm font-medium
                     hover:border-white/40 hover:bg-white/5 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#9333EA]
                     text-white text-sm font-medium shadow-[0_0_22px] shadow-violet-600/30
                     hover:from-[#A855F7] hover:to-[#9333EA]/90
                     transition-all duration-300"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
