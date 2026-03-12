'use client';

import { useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import {
    PricingProduct,
    PricingRecommendation,
    ConfidenceLevel,
} from '@/lib/mockPricingProducts';
import { Pencil, ChevronDown, Search } from 'lucide-react';


interface PricingTableProps {
  products: PricingProduct[];
  selectedRows: Set<string>;
  userAdjustedPrices: Record<string, string>;
  selectedScope: string;
  scopeDropdownOpen: boolean;
  scopeSearch: string;
  allSelected: boolean;
  someSelected: boolean;
  recommendedScopes: { label: string; value: string }[];
  filteredScopes: { label: string; value: string }[];

  // callbacks
  onToggleRow: (productId: string) => void;
  onSelectAll: () => void;
  onPriceChange: (productId: string, price: string) => void;
  onOpenModal: (product: PricingProduct) => void;
  onScopeDropdownToggle: (open: boolean) => void;
  onScopeSearch: (search: string) => void;
  onScopeChange: (scope: string) => void;
}

// Helper functions
const getRecommendationBadgeVariant = (
  rec: PricingRecommendation
): 'promo' | 'increase' | 'decrease' | 'markdown' => {
  switch (rec) {
    case 'promo':
      return 'promo';
    case 'increase':
      return 'increase';
    case 'decrease':
      return 'decrease';
    case 'markdown':
      return 'markdown';
    default:
      return 'decrease';
  }
};

const getConfidenceBadgeVariant = (
  conf?: ConfidenceLevel
): 'high' | 'medium' | 'low' => {
  switch (conf) {
    case 'High':
      return 'high';
    case 'Medium':
      return 'medium';
    case 'Low':
      return 'low';
    default:
      return 'medium';
  }
};

export function PricingTable({
  products,
  selectedRows,
  userAdjustedPrices,
  selectedScope,
  scopeDropdownOpen,
  scopeSearch,
  allSelected,
  someSelected,
  recommendedScopes,
  filteredScopes,
  onToggleRow,
  onSelectAll,
  onPriceChange,
  onOpenModal,
  onScopeDropdownToggle,
  onScopeSearch,
  onScopeChange,
}: PricingTableProps) {
  // Ref for select all checkbox
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  // Effect to set indeterminate state on checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  return (
    <div>
      {/* Recommended Scope Filter */}
      <div className="mb-4">
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--secondary-light-bg)', border: '1px solid var(--secondary)' }}>
          <label className="font-semibold text-dark">Recommended Scope</label>

          <div className="relative mt-2">
            {/* Dropdown button */}
            <button
              onClick={() => onScopeDropdownToggle(!scopeDropdownOpen)}
              className="w-full px-3 py-2 rounded-md border bg-white/10 text flex justify-between items-center --secondary-hover"
              style={{ border: '1px solid var(--secondary)' }}
            >
              {recommendedScopes.find((scope) => scope.value === selectedScope)
                ?.label || 'All recommended scopes'}

              <ChevronDown
                size={16}
                className={`${
                  scopeDropdownOpen ? 'rotate-180' : ''
                } transition-transform`}
              />
            </button>

            {/* Dropdown menu */}
            {scopeDropdownOpen && (
              <div>
                {/* Search box */}
                <div className="p-2" style={{ border: 'var(--secondary)' }}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/20">
                    <Search size={14} className="text-dark" />
                    <input
                      type="text"
                      placeholder="Search scopes..."
                      value={scopeSearch}
                      onChange={(e) => onScopeSearch(e.target.value)}
                      className="flex-1 bg-transparent placeholder:text-dark focus:outline-none"
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </div>
                </div>

                {/* List items */}
                <div className="max-h-40 overflow-y-auto">
                  {filteredScopes.map((scope) => (
                    <button
                      key={scope.value}
                      onClick={() => {
                        onScopeChange(scope.value);
                        onScopeDropdownToggle(false);
                        onScopeSearch('');
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        selectedScope === scope.value
                          ? 'bg-violet-600/30 text-white font-medium'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {scope.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          {/* Table Header */}
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--primary)',
                background:
                  'linear-gradient(135deg, var(--primary) 0%, rgb(13, 71, 161) 100%)',
              }}
            >
              <th className="px-4 py-3 text-left">
                <input
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Select all products"
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--primary-light-bg)' }}
                />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                Product
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                AI Recommendation
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                Recommended Scope
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                Current Price
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                Recommended Price
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                User Adjusted Price
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                Reason
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                Expected Impact
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'white' }}
              >
                Confidence
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {products
              .filter((product) => {
                if (selectedScope === 'all') return true;
                return product.recommendedScope.level === selectedScope;
              })
              .map((product, index) => {
                const isSelected = selectedRows.has(product.id);
                const userPrice = userAdjustedPrices[product.id] || '';

                return (
                  <tr
                    key={product.id}
                    className={`border-b transition-colors cursor-pointer ${
                      index === products.length - 1 ? 'border-b-0' : ''
                    }`}
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: isSelected
                        ? 'rgba(59,130,246,0.12)'
                        : 'transparent',
                    }}
                    onClick={() => onOpenModal(product)}
                    onMouseEnter={(e) =>
                      !isSelected &&
                      (e.currentTarget.style.backgroundColor =
                        'var(--surface-hover)')
                    }
                    onMouseLeave={(e) =>
                      !isSelected &&
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenModal(product);
                      }
                    }}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleRow(product.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${product.description}`}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: 'var(--primary)' }}
                      />
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.description}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span
                          className="font-medium"
                          style={{ color: 'var(--text-dark)' }}
                        >
                          {product.description}
                        </span>
                      </div>
                    </td>

                    {/* AI Recommendation */}
                    <td className="px-4 py-3">
                      <Badge
                        variant={getRecommendationBadgeVariant(product.action)}
                      >
                        {product.action}
                      </Badge>
                    </td>

                    {/* Recommended Scope */}
                    <td className="px-4 py-3">
                      {product.recommendedScope.level}
                    </td>

                    {/* Current Price */}
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {product.currentPrice}
                    </td>

                    {/* Recommended Price */}
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {product.finalRecommendedPrice}
                    </td>

                    {/* User Adjusted Price */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={userPrice}
                          onChange={(e) =>
                            onPriceChange(product.id, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          placeholder="Enter price"
                          className="w-24 px-3 py-1 rounded border text-sm focus:outline-none"
                          style={{
                            borderColor: 'var(--border)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text)',
                            boxShadow: 'none',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 2px var(--ring)`;
                            e.currentTarget.style.borderColor = 'transparent';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }}
                        />
                        <Pencil
                          className="w-4 h-4"
                          style={{ color: 'var(--text-muted)' }}
                        />
                      </div>
                    </td>

                    {/* Reason */}
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {product.reasonSignals}
                    </td>

                    {/* Expected Impact */}
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {product.expectedImpact}
                    </td>

                    {/* Confidence */}
                    <td className="px-4 py-3">
                      <Badge
                        variant={getConfidenceBadgeVariant(product.confidence)}
                      >
                        {product.confidence}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}